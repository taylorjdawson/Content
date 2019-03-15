const Plasma = artifacts.require('Plasma');
const {NULL_ADDRESS} = require("../utils.js");

contract('Plasma', (accounts) => {
    const owner = accounts[0];
    let root = web3.utils.soliditySha3(owner);
    const date = parseInt((new Date().getTime()) / 1000);
    describe('Exit Setup Function', () => {
        beforeEach(async() => {
            contract = await Plasma.new({from: owner})
        })

        it('should only exit an amount greater than 0', async() => {
            await expectThrow(contract.addExitToQueue(0, owner, 0, date));
        })

        it('should not add to the queue if the exit already exists', async() => {
            await contract.addExitToQueue(0, owner, 1, date);
            await expectThrow(contract.addExitToQueue(0, owner, 1, date));
        })

        it('should add the exit to the mapping of available exits', async() => {
            await contract.addExitToQueue(0, owner, 1, date);
            let exit = await contract.exits.call(0);
            assert.equal(exit[0], owner);
            assert.equal(exit[1].toNumber(), 1);
        })

        it('should emit an ExitStarted event', async() => {
            await contract.addExitToQueue(0, owner, 1, date);
            const event = await contract.getPastEvents('ExitStarted');
            assert.equal(event[0].event, 'ExitStarted');
        })
    })
})

async function expectThrow(promise) {
    const errMsg = 'Expected throw not received';
    try {
        await promise;
    } catch (err) {
        assert(err.toString().includes('revert'), errMsg);
        return;
    }

    assert(false, errMsg);
}