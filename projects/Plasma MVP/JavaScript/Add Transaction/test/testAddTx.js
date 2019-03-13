let assert = require('assert');
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const PlasmaChain = require('../plasmaChain.js');
const {Transaction} = require('../plasmaObjects.js');
const {encodeUtxoId} = require('../utils.js');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('add transaction function', function() {
    let contract;
    let plasmaChain;
    let event;
    let block;
    let tx;
    let tx2;
    const ether = '1';
    before(async () => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi, web3);
        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account1.address, 
            value: web3.utils.toWei(ether, 'ether')
        });
        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account2.address, 
            value: web3.utils.toWei(ether, 'ether')
        });
        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;
        tx = new Transaction(1,0,0,0,0,0, account2.address, transferAmount, account1.address, leftover);
        tx.sign1
    });

    it('should define a block buffer', function() {
        assert.equal(plasmaChain.blockBuffer, 1000);
    });

    it('should define the next transaction block', function() {
        assert.equal(plasmaChain.nextTxBlock, 1000);
    });

    it('should define the current block', function() {
        const currentBlock = plasmaChain.currentBlock;
        assert.equal(currentBlock.transactionSet.length, 0);
        assert.equal(currentBlock.blockNumber, plasmaChain.blockBuffer);
    });

    describe('after adding a transaction', () => {
        let id;
        before(() => {
            id = plasmaChain.addTransaction(tx);
        });

        it('should have a transaction in its transactionSet', () => {
            const transactions = plasmaChain.currentBlock.transactionSet.length;
            assert.equal(transactions, 1);
        });

        it('should return an encoded UTXO ID', () => {
            const encoded = encodeUtxoId(plasmaChain.currentBlock.blockNumber, plasmaChain.currentBlock.transactionSet.length - 1, 0);
            assert.equal(id, encoded);
        });
    });
});