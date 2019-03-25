let assert = require('chai').assert;
const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {abi} = require('../Plasma.json');
const PlasmaChain = require('../plasmaChain.js');

describe('Constructor Function', function() {
    let contract;
    let plasmaChain;
    let web3Contract;
    beforeEach(async() => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi, web3);
    });

    it('should assign the operator', function() {
        assert(plasmaChain.operator, "Could not find an operator property on your PlasmaChain instance")
        assert.equal(plasmaChain.operator, operator, "Expected the operator to be equal to the first parameter passed in");
    });

    it('should create a plasma contract instance', function() {
        assert(plasmaChain.plasmaContract, "Could not find a plasmaContract property on your PlasmaChain instance")
        const pcAddress = plasmaChain.plasmaContract.options.address;
        const contractAddress = contract.options.address;
        assert.equal(pcAddress, contractAddress, "Use the contractAddress passed in the constructor on your plasmaContract");
    });
});