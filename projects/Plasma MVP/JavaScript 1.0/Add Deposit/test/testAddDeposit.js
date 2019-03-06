let assert = require('assert');
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const PlasmaChain = require('../plasmaChain.js');

describe('add deposit function', function() {
    let contract;
    let plasmaChain;
    let event;
    let block;
    let tx;
    const ether = '1';
    beforeEach(async() => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi);
        await plasmaChain.plasmaContract.methods.deposit().send({from: account1.address, value: web3.utils.toWei(ether, 'ether')})
        event = plasmaChain.events[0];
        plasmaChain.addDeposit(event);
        block = plasmaChain.blocks[1];
        tx = block.transactionSet[0];
    });

    it('should create a new transaction with the owner within the deposit event', function() {
        assert.equal(tx.newOwner1, account1.address);
    });

    it('should create a new transaction with the amount within the deposit event', function() {
        assert.equal(tx.amount1, web3.utils.toWei(ether, 'ether'));
    });

    it('should create a new block with the block number within the deposit event', function() {
        assert.equal(block.blockNumber, 1);
    })

    it('should create a new block with only the deposit transaction in its transaction set', function() {
        const txLength = block.transactionSet.length;
        assert.equal(txLength, 1);
    })
});