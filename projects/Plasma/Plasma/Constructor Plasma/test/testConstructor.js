const Plasma = artifacts.require('Plasma');

contract('Plasma', (accounts) => {
    const owner = accounts[0];
    describe('Constructor', () => {
        beforeEach(async() => {
            contract = await Plasma.new({from: owner})
        })

        it('should initialize the operator', async() => {
            const operator = await contract.operator.call();
            assert.equal(operator, owner);
        })

        it('should initialize the block buffer', async() => {
            const buffer = await contract.BLOCK_BUFFER.call();
            assert.equal(buffer.toNumber(), 1000);
        })

        it('should initialize the current plasma block', async() => {
            const number = await contract.currentPlasmaBlock.call();
            assert.equal(number.toNumber(), 1000);
        })

        it('should initialize the current deposit block', async() => {
            const number = await contract.currentDepositBlock.call();
            assert.equal(number.toNumber(), 1);
        })
    })
})