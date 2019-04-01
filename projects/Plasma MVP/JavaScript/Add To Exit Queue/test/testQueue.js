const Plasma = artifacts.require('Plasma');

contract('Plasma', (accounts) => {
    const owner = accounts[0];
    let root = web3.utils.soliditySha3(owner);
    describe('Exit Setup Function', () => {
        beforeEach(async() => {
            contract = await Plasma.new({from: owner})
        });

        it('should add the exit to the mapping of available exits', async() => {
            await contract.addExitToQueue(0, owner, 1);
            let exit = await contract.exits.call(0);
            assert.equal(exit[0], owner);
            assert.equal(exit[1].toNumber(), 1);
        });

        it('should emit an ExitStarted event', async() => {
            await contract.addExitToQueue(0, owner, 1);
            const event = await contract.getPastEvents('ExitStarted');
            assert.equal(event[0].event, 'ExitStarted');
        });
    });
});