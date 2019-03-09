let assert = require('assert');
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const {encodeUtxoId} = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const {Transaction, Block} = require('../plasmaObjects.js');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('add block function', function() {
    let contract;
    let plasmaChain;
    let tx;
    let tx2;
    let falseTx;
    const ether = '1';
    beforeEach(async() => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi, web3);
        await plasmaChain.plasmaContract.methods.deposit().send({from: account1.address, value: web3.utils.toWei(ether, 'ether')})
        await plasmaChain.plasmaContract.methods.deposit().send({from: account2.address, value: web3.utils.toWei(ether, 'ether')})
        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;
        tx = new Transaction(1,0,0,0,0,0, account2.address, transferAmount, account1.address, leftover);
        tx2 = new Transaction(1000,0,1,0,0,0, account2.address, transferAmount, account1.address, leftover - transferAmount);
    });

    it('should instantiate the next deposit block', function() {
        const blockNum = plasmaChain.nextDepositBlock;
        assert.notEqual(blockNum, undefined);
    })

    it('should apply all transactions within the block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.addBlock(plasmaChain.currentBlock);
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
        plasmaChain.addBlock(plasmaChain.currentBlock);
        const blocksLength = Object.keys(plasmaChain.blocks).length;
        assert.equal(blocksLength, 3);
    })

    it('should allocate the correct block number as the key within blocks', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        const blockNum = plasmaChain.currentBlock.blockNumber;
        plasmaChain.addBlock(plasmaChain.currentBlock);
        assert.notEqual(plasmaChain.blocks[blockNum], undefined)
    })

    it('should not assign a block key to undefined', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.addBlock(plasmaChain.currentBlock);
        const blockKeys= Object.keys(plasmaChain.blocks);
        const correct = blockKeys.includes('undefined');
        assert.equal(correct, false);
    })

    it('should return false if the block is not synced with the Plasma contract', function () {
        const falseBlock = new Block([], 3000);
        const bool = plasmaChain.addBlock(falseBlock);
        assert.equal(bool, false);
    })

    it('should update the next transaction if submitted block is the current block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.addBlock(plasmaChain.currentBlock);
        const txBlock = plasmaChain.nextTxBlock;
        assert.equal(txBlock, 2000);
    });

    it('should update the next deposit block if submitted block is the current block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.addBlock(plasmaChain.currentBlock);
        const txBlock = plasmaChain.nextDepositBlock;
        assert.equal(txBlock, 1001);
    });

    it('should update the next deposit block if submitted block is a deposit', async function() {
        await plasmaChain.plasmaContract.methods.deposit().send({from: account1.address, value: web3.utils.toWei(ether, 'ether')})
        const txBlock = plasmaChain.nextDepositBlock;
        assert.equal(txBlock, 4);
    });
});
