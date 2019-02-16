const { web3, _testAccounts } = require('../js/web3Util.js');
const { abi } = require('../build/contracts/PriorityQueue.json');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../js/deployPlasma.js');
const { Transaction } = require('../js/plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS } = require('../js/utils.js');
const Plasma = artifacts.require('Plasma');
const PriorityQueue = artifacts.require('PriorityQueue');
const PlasmaChain = require('../plasmaChain.js');
const Web3Utils = require('web3-utils');

contract('Plasma', (accounts) => {

    const ether = web3.utils.toWei('1', 'ether');
    let pqContract = new web3.eth.Contract(abi);

    describe('Finalize Exit Function', () => {
        // MIGHT WANT TO PULL EXIT BOND VALUE FROM CONTRACT INSTEAD OF HARDCODING
        beforeEach(async () => {
            contract = await deploy(operator.address);
            plasmaChain = new PlasmaChain(operator, contract.options.address);

            await plasmaChain.plasmaContract.methods.deposit().send({ from: account1.address, value: ether })
            transferAmount = 10000;
            const ogAmount = 1000000000000000000;
            const leftover1 = ogAmount - transferAmount;
            const leftover2 = leftover1 - transferAmount;

            tx = new Transaction(1, 0, 0, 0, 0, 0,
                account2.address, transferAmount,
                account1.address, leftover1,
                NULL_ADDRESS);

            tx2 = new Transaction(1000, 0, 1, 0, 0, 0,
                account2.address, transferAmount,
                account1.address, leftover2,
                NULL_ADDRESS);

            tx3 = new Transaction(1000, 0, 0, 0, 0, 0,
                account1.address, transferAmount,
                NULL_ADDRESS, 0,
                NULL_ADDRESS);

            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);
            plasmaChain.addTransaction(tx3);

            await tx2.sign1(account1.privateKey);
            await tx3.sign1(account2.privateKey);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);
            utxoPos = encodeUtxoId(1000, 1, 0);
            utxoPos2 = encodeUtxoId(1000, 2, 0);

            // Exiting Transaction
            txBytes = "0x" + tx2.encoded().toString('hex');
            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1], 1);
            proofBytes = "0x" + proof[0].data.toString('hex') + proof[1].data.toString('hex');
            confirmationSig = tx2.confirm(merkle.getRoot(), account1.privateKey);
            sigs = tx2.sig1 + tx2.sig2.slice(2) + confirmationSig;

            // Second Exiting Transaction
            txBytes2 = "0x" + tx3.encoded().toString('hex');
            proof2 = merkle.getProof(merkle.leaves[2], 2);
            proofBytes2 = "0x" + proof2[0].data.toString('hex') + proof2[1].data.toString('hex');
            confirmationSig2 = tx3.confirm(merkle.getRoot(), account2.privateKey);
            sigs2 = tx3.sig1 + tx3.sig2.slice(2) + confirmationSig2;

            await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: 1000000000000000000 });
            await plasmaChain.plasmaContract.methods.startExit(utxoPos2, txBytes2, proofBytes2, sigs2).send({ from: account1.address, gas: 200000, value: 1000000000000000000 });

            // Increases time by 2 weeks plus 1
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [1209601],
                id: new Date().getSeconds()
            }, (err, resp) => {
                if (!err) {
                    web3.currentProvider.send({
                        jsonrpc: '2.0',
                        method: 'evm_mine',
                        params: [],
                        id: new Date().getSeconds()
                    })
                }
            });

            // Priority Queue Contract
            const pqAddress = await plasmaChain.plasmaContract.methods.exitQueues(NULL_ADDRESS).call();
            pqContract.options.address = pqAddress;
        })

        it('should finalize an exit', async () => {
            await plasmaChain.plasmaContract.methods.finalizeExits(NULL_ADDRESS).send({ from: operator.address, gas: 200000 });
        })

        it('should transfer the exit amount plus exit bond to the proper exitor', async () => {
            const exitBond = await plasmaChain.plasmaContract.methods.EXIT_BOND().call();
            const begBalance = await web3.eth.getBalance(account2.address);
            const expectedChange = Web3Utils.toBN(exitBond).add(Web3Utils.toBN(transferAmount))
            await plasmaChain.plasmaContract.methods.finalizeExits(NULL_ADDRESS).send({ from: operator.address, gas: 200000 });
            const newBalance = await web3.eth.getBalance(account2.address);
            const totalChange = Web3Utils.toBN(newBalance).sub(Web3Utils.toBN(begBalance))
            assert.equal(expectedChange.toString(), totalChange.toString());
        })

        // Tests will run out of gas if not satisfied due to infinite loop
        it('should remove and finalize multiple exits from the queue', async () => {
            await plasmaChain.plasmaContract.methods.finalizeExits(NULL_ADDRESS).send({ from: operator.address, gas: 200000 });
            const heapLength = await pqContract.methods.currentSize().call();
            assert.equal(heapLength, 0);
        })

        it('should delete the exitor from the specific exit', async () => {
            await plasmaChain.plasmaContract.methods.finalizeExits(NULL_ADDRESS).send({ from: operator.address, gas: 200000 });
            const exit = await plasmaChain.plasmaContract.methods.exits(utxoPos).call();
            assert.equal(exit.exitor, NULL_ADDRESS);
        });
    })
})
