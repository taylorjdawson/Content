const ExitQueue = artifacts.require('ExitQueue');

contract('Exit Queue', (accounts) => {
    const owner = accounts[0];
    beforeEach(async () => {
        contract = await ExitQueue.new({ from: owner })
    });

    describe('after first enqueue', () => {
        beforeEach(async () => {
            await contract.enqueue(0, 1);
        });

        it('should have a size of one', async () => {
            const size = await contract.currentSize();
            assert.equal(size, 1);
        });

        it('should return the values when peeked', async () => {
            const [zero, one] = Object.values(await contract.peek());
            assert.equal(zero, 0);
            assert.equal(one, 1);
        });

        describe('after a subsequent dequeue', () => {
            beforeEach(async () => {
                await contract.dequeue();
            });

            it('should have a size of zero', async () => {
                const size = await contract.currentSize();
                assert.equal(size, 0);
            });
            
            it('should throw when peeking', async () => {
                expectThrow(contract.peek());
            });
        });

        describe('enqueuing a second', () => {
            beforeEach(async () => {
                await contract.enqueue(2, 3);
            });

            it('should have a size of two', async () => {
                const size = await contract.currentSize();
                assert.equal(size, 2);
            });

            it('should peek the first one', async () => {
                const [zero, one] = Object.values(await contract.peek());
                assert.equal(zero, 0);
                assert.equal(one, 1);
            });

            describe('after dequeue', () => {
                beforeEach(async () => {
                    await contract.dequeue();
                });

                it('should have a size of one', async () => {
                    const size = await contract.currentSize();
                    assert.equal(size, 1);
                });

                it('should peek the second one', async () => {
                    const [two, three] = Object.values(await contract.peek());
                    assert.equal(two, 2);
                    assert.equal(three, 3);
                });

                describe('after dequeue', () => {
                    beforeEach(async () => {
                        await contract.dequeue();
                    });
                    
                    it('should have a size of zero', async () => {
                        const size = await contract.currentSize();
                        assert.equal(size, 0);
                    });

                    it('should throw when peeking', async () => {
                        expectThrow(contract.peek());
                    });
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