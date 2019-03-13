let assert = require('assert');
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const {encodeUtxoId} = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const {Transaction, TransactionInput, TransactionOutput} = require('../plasmaObjects.js');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('submit block function', function() {
    let contract;
    let plasmaChain;
    let tx;
    let tx2;
    let falseTx;
    const depositedEther = web3.utils.toWei('1', 'ether');
    beforeEach(async() => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator.address, contract.options.address, abi, web3);

        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account1.address,
            value: depositedEther
        });
        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account2.address,
            value: depositedEther
        });
        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;
        tx = new Transaction(
            new TransactionInput(1, 0, 0),
            new TransactionInput(0, 0, 0),
            new TransactionOutput(account2.address, transferAmount),
            new TransactionOutput(account1.address, leftover),
        );
        tx2 = new Transaction(
            new TransactionInput(1000, 0, 1),
            new TransactionInput(0, 0, 0),
            new TransactionOutput(account2.address, transferAmount),
            new TransactionOutput(account1.address, leftover - transferAmount),
        );
    });

    it('should apply all transactions within the block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.submitBlock(plasmaChain.currentBlock);
        const utxoId1 = encodeUtxoId(1,0,0);
        const utxoId2 = encodeUtxoId(1000,0,1);
        const transaction1 = plasmaChain.getTransaction(utxoId1);
        const transaction2 = plasmaChain.getTransaction(utxoId2);

        assert.equal(transaction1.output1.spent, true);
        assert.equal(transaction2.output2.spent, true);
    })

    it('should add the current block to submitted blocks', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.submitBlock(plasmaChain.currentBlock);
        const blocksLength = Object.keys(plasmaChain.blocks).length;
        assert.equal(blocksLength, 3);
    })

    it('should not assign a block key to undefined', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.submitBlock(plasmaChain.currentBlock);
        const blockKeys= Object.keys(plasmaChain.blocks);
        const correct = blockKeys.includes('undefined');
        assert.equal(correct, false);
    })

    it('should update the next transaction if submitted block is the current block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.submitBlock(plasmaChain.currentBlock);
        const txBlock = plasmaChain.nextTxBlock;
        assert.equal(txBlock, 2000);
    });

    it('should update the next deposit block if submitted block is the current block', function() {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.submitBlock(plasmaChain.currentBlock);
        const txBlock = plasmaChain.nextDepositBlock;
        assert.equal(txBlock, 1001);
    });

    it('should update the next deposit block if submitted block is a deposit', async function() {
        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account1.address, 
            value: depositedEther
        });
        const txBlock = plasmaChain.nextDepositBlock;
        assert.equal(txBlock, 4);
    });

    it('should submit the block to the plasma contract', async () => {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        const root = plasmaChain.currentBlock.merkle().getRoot();
        await plasmaChain.submitBlock(plasmaChain.currentBlock);
        let events = await contract.getPastEvents('BlockSubmitted')
        let blockRoot = events[0].returnValues.root;
        assert.equal(root, blockRoot);
    });
});
