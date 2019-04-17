let assert = require('assert');
const { web3, _testAccounts } = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { abi } = require('../Plasma.json');
const { encodeUtxoId } = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const { Transaction, TransactionInput, TransactionOutput } = require('../plasmaObjects.js');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('get UTXO', function () {
    let contract;
    let plasmaChain;
    let event;
    let block;
    let tx;
    let tx2;
    const ether = '1';
    beforeEach(async () => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi, web3);
        await plasmaChain.plasmaContract.methods.deposit().send({ 
            from: account1.address, 
            value: web3.utils.toWei(ether, 'ether') 
        }); // Block 1
        await plasmaChain.plasmaContract.methods.deposit().send({ 
            from: account2.address, 
            value: web3.utils.toWei(ether, 'ether') 
        }); // Block 2
        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;
        tx = new Transaction(
            new TransactionInput(1,0,0), 
            new TransactionInput(0,0,0), 
            new TransactionOutput(account2.address, transferAmount), 
            new TransactionOutput(account1.address, leftover),
        ); // Block 1000
        tx2 = new Transaction(
            new TransactionInput(1000,0,1), 
            new TransactionInput(0,0,0), 
            new TransactionOutput(account2.address, transferAmount), 
            new TransactionOutput(account1.address, leftover - transferAmount),
        ); // Block 1000
    });

    it('should return a transaction within the current block (1000)', function () {
        const utxoId = encodeUtxoId(1000, 1, 0);
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert(transaction instanceof Transaction, "getTransaction did not return an instance of Transaction!");
        assert.equal(transaction.input1.blockNumber, 1000, "The Transaction blockNumber is incorrect");
        assert.equal(transaction.input1.transactionIndex, 0, "The Transaction transactionIndex is incorrect");
        assert.equal(transaction.input1.outputIndex, 1, "The Transaction outputIndex is incorrect");
    });

    it('should return a transaction from the plasmaChain deposit blocks', function () {
        const utxoId = encodeUtxoId(1, 0, 0);
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert(transaction instanceof Transaction, "getTransaction did not return an instance of Transaction!");
        assert.equal(transaction.input1.blockNumber, 0, "The Transaction blockNumber is incorrect");
        assert.equal(transaction.input1.transactionIndex, 0, "The Transaction transactionIndex is incorrect");
        assert.equal(transaction.input1.outputIndex, 0, "The Transaction outputIndex is incorrect");
    });
});
