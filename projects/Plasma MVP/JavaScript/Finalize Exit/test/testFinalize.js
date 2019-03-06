const { Transaction } = require('../plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS } = require('../utils.js');
const { privateKeyOperator, privateKey1, privateKey2 } = require("../privateKeys.js");
const Plasma = artifacts.require('Plasma');
const PriorityQueue = artifacts.require('PriorityQueue');
const PlasmaChain = require('../plasmaChain.js');
web3.setProvider(new web3.providers.WebsocketProvider('http://127.0.0.1:7545/'))

// Finalize Exit => Stage 17
contract('Plasma', (accounts) => {

    const ether = web3.utils.toWei('1', 'ether');
    let pqContract;
    let bond;

    describe('Finalize Exit Function', () => {
        beforeEach(async () => {
            operator = await web3.eth.personal.importRawKey(privateKeyOperator, "password1234");
            address1 = await web3.eth.personal.importRawKey(privateKey1, "password1234");
            address2 = await web3.eth.personal.importRawKey(privateKey2, "password1234");
            // use that password to unlock the account so truffle can use it
            await web3.eth.personal.unlockAccount(operator, 'password1234', 6000);
            await web3.eth.personal.unlockAccount(address1, 'password1234', 6000);
            await web3.eth.personal.unlockAccount(address2, 'password1234', 6000);

            // give our new account some ether from an already loaded account
            await web3.eth.sendTransaction({ from: accounts[0], to: operator, value: web3.utils.toWei("1") })
            await web3.eth.sendTransaction({ from: accounts[1], to: address1, value: web3.utils.toWei("3") })
            await web3.eth.sendTransaction({ from: accounts[2], to: address2, value: web3.utils.toWei("2") })

            contract = await Plasma.new({ from: operator })
            pqContract = await PriorityQueue.new({ from: operator });
            pqContract = await new web3.eth.Contract(pqContract.abi);
            plasmaChain = new PlasmaChain(operator, contract.address, contract.abi, web3);

            await contract.deposit({ from: address1, value: ether })
            transferAmount = 10000;
            const ogAmount = 1000000000000000000;
            const leftover1 = ogAmount - transferAmount;
            const leftover2 = leftover1 - transferAmount;

            tx = new Transaction(1, 0, 0, 0, 0, 0,
                address2, transferAmount,
                address1, leftover1,
                NULL_ADDRESS);

            tx2 = new Transaction(1000, 0, 1, 0, 0, 0,
                address2, transferAmount,
                address1, leftover1 - transferAmount,
                NULL_ADDRESS);

            tx3 = new Transaction(1000, 0, 0, 0, 0, 0,
                address1, transferAmount,
                NULL_ADDRESS, 0,
                NULL_ADDRESS);

            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);
            plasmaChain.addTransaction(tx3);

            await tx2.sign1(privateKey1);
            await tx3.sign1(privateKey2);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);
            utxoPos = encodeUtxoId(1000, 1, 0);
            utxoPos2 = encodeUtxoId(1000, 2, 0);

            // Exiting Transaction
            txBytes = "0x" + tx2.encoded().toString('hex');
            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1], 1);
            proofBytes = "0x" + proof[0].data.toString('hex') + proof[1].data.toString('hex');
            confirmationSig = tx2.confirm(merkle.getRoot(), privateKey1);
            sigs = tx2.sig1 + tx2.sig2.slice(2) + confirmationSig;

            // Second Exiting Transaction
            txBytes2 = "0x" + tx3.encoded().toString('hex');
            proof2 = merkle.getProof(merkle.leaves[2], 2);
            proofBytes2 = "0x" + proof2[0].data.toString('hex') + proof2[1].data.toString('hex');
            confirmationSig2 = tx3.confirm(merkle.getRoot(), privateKey2);
            sigs2 = tx3.sig1 + tx3.sig2.slice(2) + confirmationSig2;

            bond = await contract.EXIT_BOND();
            await contract.startExit(utxoPos, txBytes, proofBytes, sigs, { from: address2, gas: 200000, value: bond })
            await contract.startExit(utxoPos2, txBytes2, proofBytes2, sigs2, { from: address1, gas: 200000, value: bond })

            // // Increases time by 2 weeks plus 1
            const timeOptions = {
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [1209601],
                id: new Date().getSeconds()
            }

            const mineOptions = {
                jsonrpc: '2.0',
                method: 'evm_mine',
                params: [],
                id: new Date().getSeconds()
            }

            await web3.currentProvider.send(timeOptions, () => (timeOptions));
            await web3.currentProvider.send(mineOptions, () => (mineOptions));

            // // Priority Queue Contract
            const pqAddress = await contract.exitQueues(NULL_ADDRESS);
            pqContract.options.address = pqAddress;
        })

        it('should finalize an exit', async () => {
            await contract.finalizeExits(NULL_ADDRESS, { from: operator, gas: 200000 })
        })

        it('should transfer the exit amount plus exit bond to the proper exitor', async () => {
            const begBalance = await web3.eth.getBalance(address2);
            const expectedChange = web3.utils.toBN(bond).add(web3.utils.toBN(transferAmount))
            await contract.finalizeExits(NULL_ADDRESS, { from: operator, gas: 200000 })
            const newBalance = await web3.eth.getBalance(address2);
            const totalChange = web3.utils.toBN(newBalance).sub(web3.utils.toBN(begBalance))
            assert.equal(expectedChange.toString(), totalChange.toString());
        })

        // Tests will run out of gas if not satisfied due to infinite loop
        it('should remove and finalize multiple exits from the queue', async () => {
            await contract.finalizeExits(NULL_ADDRESS, { from: operator, gas: 200000 })
            const heapLength = await pqContract.methods.currentSize().call();
            assert.equal(heapLength, 0);
        })

        it('should delete the exitor from the specific exit', async () => {
            await contract.finalizeExits(NULL_ADDRESS, { from: operator, gas: 200000 })
            const exit = await contract.exits(utxoPos);
            assert.equal(exit.exitor, NULL_ADDRESS);
        });
    })
})