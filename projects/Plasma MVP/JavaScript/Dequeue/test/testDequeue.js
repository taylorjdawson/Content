const ExitQueue = artifacts.require('ExitQueue');
const exitDateError = "Exit Date is incorrect";
const utxoPosError = "UTXO Position is incorrect";

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
            assert.equal(size.toNumber(), 1);
        });

        it('should return the values when peeked', async () => {
            const [zero, one] = Object.values(await contract.peek());
            assert.equal(zero.toNumber(), 0, exitDateError);
            assert.equal(one.toNumber(), 1, utxoPosError);
        });

        describe('after a subsequent dequeue', () => {
            beforeEach(async () => {
                await contract.dequeue();
            });

            it('should have a size of zero', async () => {
                const size = await contract.currentSize();
                assert.equal(size.toNumber(), 0);
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
                assert.equal(size.toNumber(), 2);
            });

            it('should peek the first one', async () => {
                const [zero, one] = Object.values(await contract.peek());
                assert.equal(zero.toNumber(), 0, exitDateError);
                assert.equal(one.toNumber(), 1, utxoPosError);
            });

            describe('after dequeue', () => {
                beforeEach(async () => {
                    await contract.dequeue();
                });

                it('should have a size of one', async () => {
                    const size = await contract.currentSize();
                    assert.equal(size.toNumber(), 1);
                });

                it('should peek the second one', async () => {
                    const [two, three] = Object.values(await contract.peek());
                    assert.equal(two.toNumber(), 2, exitDateError);
                    assert.equal(three.toNumber(), 3, utxoPosError);
                });

                describe('after dequeue', () => {
                    beforeEach(async () => {
                        await contract.dequeue();
                    });
                    
                    it('should have a size of zero', async () => {
                        const size = await contract.currentSize();
                        assert.equal(size.toNumber(), 0);
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