let assert = require('assert');
const { web3, _testAccounts } = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { abi } = require('../Plasma.json');
const { encodeUtxoId } = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const { Transaction } = require('../plasmaObjects.js');
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
        tx = new Transaction(1, 0, 0, 0, 0, 0, 
            account2.address, transferAmount, 
            account1.address, leftover
        ); // Block 1000
        tx2 = new Transaction(1000, 0, 1, 0, 0, 0, 
            account2.address, transferAmount, 
            account1.address, leftover - transferAmount
        ); // Block 1000
    });

    it('should return a transaction within the current block', function () {
        plasmaChain.addTransaction(tx);
        const utxoId = plasmaChain.addTransaction(tx2);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert.equal(transaction.blkNum1, 1000);
        assert.equal(transaction.txIndex1, 0);
        assert.equal(transaction.oIndex1, 1);
    });

    it('should return a transaction within the plasma chain blocks', function () {
        const utxoId = encodeUtxoId(1, 0, 0);
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert.equal(transaction.blkNum1, 0);
        assert.equal(transaction.txIndex1, 0);
        assert.equal(transaction.oIndex1, 0);
    });
});
