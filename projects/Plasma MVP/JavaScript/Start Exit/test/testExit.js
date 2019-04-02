const { Transaction, TransactionInput, TransactionOutput } = require('../plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS, NULL_SIGNATURE } = require('../utils.js');
const { privateKeyOperator, privateKey1, privateKey2 } = require("../privateKeys.js");
const PlasmaChain = require('../plasmaChain.js');
const Plasma = artifacts.require('Plasma');
web3.setProvider(new web3.providers.WebsocketProvider('http://127.0.0.1:7545/'));
const PW = 'rawkeypassword';

contract('Plasma', (accounts) => {

    describe('Start Exit Function', () => {
        const ether = web3.utils.toWei('1', 'ether');
        let utxoId;
        let tx;
        let tx2;
        let txBytes;
        let proof;
        let merkle;
        let confirmationHash;
        let sigs;
        let bond;
        let operator;
        let address1;
        let address2;
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
            await web3.eth.sendTransaction({ from: accounts[1], to: address1, value: web3.utils.toWei("2") })
            await web3.eth.sendTransaction({ from: accounts[2], to: address2, value: web3.utils.toWei("2") })

            contract = await Plasma.new({ from: operator })
            plasmaChain = new PlasmaChain(operator, contract.address, contract.abi, web3);
            
            await contract.deposit({ from: address1, value: ether })

            const transferAmount = 10000;
            const ogAmount = 1000000000000000000;
            const leftover = ogAmount - transferAmount;

            tx = new Transaction(
                new TransactionInput(1, 0, 0),
                new TransactionInput(0, 0, 0),
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover),
            );

            tx2 = new Transaction(
                new TransactionInput(1000, 0, 1),
                new TransactionInput(0, 0, 0),
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover - transferAmount),
            );

            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);

            await tx2.sign1(privateKey1);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);

            utxoPos = encodeUtxoId(1000, 1, 0);
            txBytes = "0x" + tx2.encoded().toString('hex');
            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1]);
            proofBytes = "0x" + proof[0].data.toString('hex');
            confirmationSig = tx2.confirm(merkle.getRoot(), privateKey1);
            sigs = tx2.input1.signature + tx2.input2.signature.slice(2) + confirmationSig;
            
            bond = await plasmaChain.plasmaContract.methods.EXIT_BOND().call();
        });

        it('should start an exit', async () => {
            await contract.startExit(utxoPos, txBytes, proofBytes, sigs, { from: address2, gas: 200000, value: bond });
            
            const { exitor, amount } = await contract.exits(utxoPos);
            assert.equal(exitor.toLowerCase(), address2, "Exitor address was not expected");
            assert.equal(amount, tx2.output1.amount, "Exit Amount was not expected");
        });

        it('should emit an ExitStarted event', async () => {
            await contract.startExit(utxoPos, txBytes, proofBytes, sigs, { from: address2, gas: 200000, value: bond });

            let events = await contract.getPastEvents('ExitStarted');
            let exit = events[0].event;

            assert.equal(exit, 'ExitStarted');
        });
    });
});