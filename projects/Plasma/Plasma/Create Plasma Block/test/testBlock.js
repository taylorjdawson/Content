const Plasma = artifacts.require('Plasma');
const errors = [
    "Make sure to declare a public mapping for the plasma chain!",
    "Make sure to declare a public mapping for the transactions!",
    "Make sure to declare a public uint for the confirmations!",
]

contract('Plasma', function(accounts) {
    describe('Transaction Tests', function() {
        it('should define a plasmaChain mapping', async function() {
	        const plasmaChain = Plasma.abi.filter(x => x.name === 'plasmaChain')[0];
            assert(plasmaChain, errors[0]);
            assert.deepEqual(plasmaChain.inputs.map(x => x.type), ['uint256']);
          	assert.deepEqual(plasmaChain.outputs.map(x => x.type), ['bytes32', 'uint256']);
        });
    })
});