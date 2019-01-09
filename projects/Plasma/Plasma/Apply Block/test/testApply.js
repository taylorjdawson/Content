let assert = require('assert');
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const {encodeUtxoId} = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const {Transaction} = require('../plasmaObjects.js');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('apply block function', function() {
    let contract;
    let plasmaChain;
    let tx;
    let tx2;
    const ether = '1';
    beforeEach(async() => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address);
        await plasmaChain.plasmaContract.methods.deposit().send({from: account1.address, value: web3.utils.toWei(ether, 'ether')})
        await plasmaChain.plasmaContract.methods.deposit().send({from: account2.address, value: web3.utils.toWei(ether, 'ether')})
        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;
        tx = new Transaction(1,0,0,0,0,0, account2.address, transferAmount, account1.address, leftover);
        tx2 = new Transaction(1000,0,1,0,0,0, account2.address, transferAmount, account1.address, leftover - transferAmount);
    });

    it('should mark the utxo as spent for an oIndex of 0', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.applyTransaction(tx);
        const utxoId = encodeUtxoId(1,0,0);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert.equal(transaction.spent1, true);
    });

    it('should mark the utxo as spent for an oIndex of 1', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.applyTransaction(tx2);
        const utxoId = encodeUtxoId(1000,0,1);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert.equal(transaction.spent2, true);
    });

    it('should apply all transactions within the block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.applyBlock(plasmaChain.currentBlock);
        const utxoId1 = encodeUtxoId(1,0,0);
        const utxoId2 = encodeUtxoId(1000,0,1);
        const transaction1 = plasmaChain.getTransaction(utxoId1);
        const transaction2 = plasmaChain.getTransaction(utxoId2);
        assert.equal(transaction1.spent1, true);
        assert.equal(transaction2.spent2, true);
    })

    it('should add the current block to submitted blocks', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.applyBlock(plasmaChain.currentBlock);
        const blocksLength = Object.keys(plasmaChain.blocks).length;
        assert.equal(blocksLength, 3);
    })
  
  	it('should not assign a block key to undefined', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.applyBlock(plasmaChain.currentBlock);
        const blockKeys= Object.keys(plasmaChain.blocks);
        const correct = blockKeys.includes('undefined');
        assert.equal(correct, false);
    })
});