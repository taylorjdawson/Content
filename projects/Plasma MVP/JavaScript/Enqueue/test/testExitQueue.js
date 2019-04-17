const ExitQueue = artifacts.require('ExitQueue');

contract('Exit Queue', (accounts) => {
    const owner = accounts[0];
    before(async () => {
        contract = await ExitQueue.new({ from: owner })
    });

    describe('after first enqueue', () => {
        before(async () => {
            await contract.enqueue(0, 0);
        });

        it('should have a size of one', async () => {
            const size = await contract.currentSize();
            assert.equal(size.toNumber(), 1);
        });

        describe('after second enqueue', () => {
            before(async () => {
                await contract.enqueue(0, 0);
            });

            it('should have a size of two', async () => {
                const size = await contract.currentSize();
                assert.equal(size.toNumber(), 2);
            });

            describe('after third enqueue', () => {
                before(async () => {
                    await contract.enqueue(0, 0);
                });

                it('should have a size of three', async () => {
                    const size = await contract.currentSize();
                    assert.equal(size.toNumber(), 3);
                });
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