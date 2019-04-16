const { Transaction, TransactionInput, TransactionOutput } = require('../plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS } = require('../utils.js');
const { privateKeyOperator, privateKey1, privateKey2 } = require("../privateKeys.js");
const Plasma = artifacts.require('Plasma');
const PlasmaChain = require('../plasmaChain.js');
web3.setProvider(new web3.providers.WebsocketProvider('http://127.0.0.1:7545/'));
const PW = "rawPkPassword";

contract('Plasma', (accounts) => {
    const ether = web3.utils.toWei('1', 'ether');
    let bond;
    describe('Finalize Exit Function', () => {
        beforeEach(async () => {
            operator = await web3.eth.personal.importRawKey(privateKeyOperator, PW);
            address1 = await web3.eth.personal.importRawKey(privateKey1, PW);
            address2 = await web3.eth.personal.importRawKey(privateKey2, PW);
            // use that password to unlock the account so truffle can use it
            await web3.eth.personal.unlockAccount(operator, PW, 6000);
            await web3.eth.personal.unlockAccount(address1, PW, 6000);
            await web3.eth.personal.unlockAccount(address2, PW, 6000);

            // give our new account some ether from an already loaded account
            await web3.eth.sendTransaction({ from: accounts[0], to: operator, value: web3.utils.toWei("1") })
            await web3.eth.sendTransaction({ from: accounts[1], to: address1, value: web3.utils.toWei("4") })
            await web3.eth.sendTransaction({ from: accounts[2], to: address2, value: web3.utils.toWei("2") })

            contract = await Plasma.new({ from: operator })
            plasmaChain = new PlasmaChain(operator, contract.address, contract.abi, web3);

            await contract.deposit({ from: address1, value: ether })
            transferAmount = 10000;
            const ogAmount = 1000000000000000000;
            const leftover1 = ogAmount - transferAmount;
            const leftover2 = leftover1 - transferAmount;

            tx = new Transaction(
                new TransactionInput(1, 0, 0),
                undefined,
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover1),
            );

            tx2 = new Transaction(
                new TransactionInput(1000, 0, 1),
                undefined,
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover1 - transferAmount),
            );

            tx3 = new Transaction(
                new TransactionInput(1000, 0, 0),
                undefined,
                new TransactionOutput(address1, transferAmount),
                new TransactionOutput(NULL_ADDRESS, 0),
            );

            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);
            // double spend tx3
            plasmaChain.addTransaction(tx3);
            plasmaChain.addTransaction(tx3);

            await tx2.sign1(privateKey1);
            await tx3.sign1(privateKey2);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);

            bond = await contract.EXIT_BOND();

            async function startExit(utxoPos, tx, leafIndex, pkey, address) {
                txBytes = "0x" + tx.encoded().toString('hex');
                merkle = plasmaChain.blocks[1000].merkle();
                proof = merkle.getProof(merkle.leaves[leafIndex], leafIndex);
                proofBytes = "0x" + proof[0].data.toString('hex') + proof[1].data.toString('hex');
                confirmationSig = tx.confirm(merkle.getRoot(), pkey);
                sigs = tx.input1.signature + tx.input2.signature.slice(2) + confirmationSig;
                await contract.startExit(utxoPos, txBytes, proofBytes, sigs, { from: address, gas: 200000, value: bond });
            }

            await startExit(encodeUtxoId(1000, 3, 0), tx3, 2, privateKey2, address1);
            await startExit(encodeUtxoId(1000, 2, 0), tx3, 2, privateKey2, address1);
            await startExit(encodeUtxoId(1000, 1, 0), tx2, 1, privateKey1, address2);
            
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
        });

        it('should transfer the exit amount plus exit bond to the proper exitor', async () => {
            const begBalance = await web3.eth.getBalance(address2);
            const expectedChange = web3.utils.toBN(bond).add(web3.utils.toBN(transferAmount));
            await contract.finalizeExits({ from: operator, gas: 200000 });
            const newBalance = await web3.eth.getBalance(address2);
            const totalChange = web3.utils.toBN(newBalance).sub(web3.utils.toBN(begBalance));
            assert.equal(expectedChange.toString(), totalChange.toString());
        });
    });
});