const ExitQueue = artifacts.require('ExitQueue');

contract('Exit Priority Queue', (accounts) => {
    const owner = accounts[0];
    beforeEach(async () => {
        contract = await ExitQueue.new({ from: owner })
    });

    describe('after first enqueue', () => {
        const firstPriority = 2;
        beforeEach(async () => {
            await contract.enqueue(firstPriority);
        });

        it('should have a size of one', async () => {
            const size = await contract.currentSize();
            assert.equal(size, 1);
        });

        it('should return the value when peeked', async () => {
            const v = await contract.peek();
            assert.equal(v, firstPriority);
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

        describe('enqueuing a second, higher priority', () => {
            const secondPriority = 4;
            beforeEach(async () => {
                await contract.enqueue(secondPriority);
            });

            it('should have a size of two', async () => {
                const size = await contract.currentSize();
                assert.equal(size, 2);
            });

            it('should peek this one', async () => {
                const v = await contract.peek();
                assert.equal(v, secondPriority);
            });

            describe('enqueuing a third, middle priority', () => {
                const thirdPriority = 3;
                beforeEach(async () => {
                    await contract.enqueue(thirdPriority);
                });

                it('should have a size of three', async () => {
                    const size = await contract.currentSize();
                    assert.equal(size, 3);
                });

                it('should peek the second', async () => {
                    const v = await contract.peek();
                    assert.equal(v, secondPriority);
                });

                describe('after dequeue', () => {
                    beforeEach(async () => {
                        await contract.dequeue();
                    });

                    it('should have a size of two', async () => {
                        const size = await contract.currentSize();
                        assert.equal(size, 2);
                    });

                    it('should peek the third one', async () => {
                        const v = await contract.peek();
                        assert.equal(v, thirdPriority);
                    });

                    describe('after dequeue', () => {
                        beforeEach(async () => {
                            await contract.dequeue();
                        });

                        it('should have a size of one', async () => {
                            const size = await contract.currentSize();
                            assert.equal(size, 1);
                        });

                        it('should peek the first one', async () => {
                            const v = await contract.peek();
                            assert.equal(v, firstPriority);
                        });
                    });
                });
            });

            describe('after dequeue', () => {
                beforeEach(async () => {
                    await contract.dequeue();
                });

                it('should have a size of one', async () => {
                    const size = await contract.currentSize();
                    assert.equal(size, 1);
                });

                it('should peek the first one', async () => {
                    const v = await contract.peek();
                    assert.equal(v, firstPriority);
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