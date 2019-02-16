let assert = require('chai').assert;
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const PlasmaChain = require('../plasmaChain.js');

describe('Constructor Function', function() {
    console.log(web3.currentProvider)
    let contract;
    let plasmaChain;
    let web3Contract;
    beforeEach(async() => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address);
    });

    it('should assign the operator', function() {
        assert.equal(plasmaChain.operator, operator);
    });

    it('should create a plasma contract instance', function() {
        const pcAddress = plasmaChain.plasmaContract.options.address;
        const contractAddress = contract.options.address;
        assert.equal(pcAddress, contractAddress);
    })

    it('should store a log of events', function() {
        assert.equal(plasmaChain.events.length, 0);
    })

    it('should listen for deposits to the contract', async() => {
        const ether = '1';
        await plasmaChain.plasmaContract.methods.deposit().send({from: account1.address, value: web3.utils.toWei(ether, 'ether')})
        const events = plasmaChain.events;
        const eventName = events[0].event;
        assert.equal(eventName, 'DepositCreated');
    })
});