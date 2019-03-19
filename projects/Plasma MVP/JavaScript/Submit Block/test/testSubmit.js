const Plasma = artifacts.require('Plasma');

contract('Plasma', (accounts) => {
    const owner = accounts[0];
    let root = web3.utils.soliditySha3(owner);
    describe('Submit Function', () => {
        before(async () => {
            contract = await Plasma.new({from: owner})
            await contract.submitBlock(root, {from: owner})
        });

        it('should create a new plasma block and add to the plasma chain', async () => {
            const block = await contract.plasmaChain.call(1000);
            const blockRoot = block[0];
            assert.equal(blockRoot, web3.utils.soliditySha3(owner))
        });
       
        it('should increment the current plasma block', async () => {
            const counter = await contract.currentPlasmaBlock.call();
            assert.equal(counter.toNumber(), 2000);
        });

        it('should set the current deposit block to 1', async () => {
            const number = await contract.currentDepositBlock.call();
            assert.equal(number.toNumber(), 1);
        });

        it('should log the submitted block', async () => {
            const events = await contract.getPastEvents('BlockSubmitted');
            const event = events[0];
            assert(event, "Did not find a BlockSubmitted event");
            assert(event.args.root, "Did not find a root argument on the BlockSubmitted event");
            assert(event.args.timestamp, "Did not find a timestamp argument on the BlockSubmitted event");
        });

        describe('security', () => {
            it('should only be callable by the operator', async () => {
                const root2 = web3.utils.soliditySha3(accounts[1]);
                await expectThrow(contract.submitBlock(root2, {from: accounts[1]}))
            });
        });
    });
});

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
