const Buidlathon = artifacts.require('Buidlathon');

contract('Buidlathon', (accounts) => {
    describe('Entering five participants', () => {
        let contract;

        beforeEach(async () => {
            contract = await Buidlathon.new(10);
            for (let i = 0; i < 4; i++) {
                await contract.enter.sendTransaction({ from: accounts[i] });
            }
        });

        it('should successfully add the participants', async () => {
            const actual = await contract.numberOfParticipants.call();
            assert.equal(actual.toNumber(), 4);
        });

        it('should throw on double entry of the first participant', async () => {
            let exception;
            try {
                await contract.enter.sendTransaction({ from: accounts[0] });
            }
            catch (ex) {
                exception = ex;
            }
            assert(exception, "Expected an exception to be thrown upon re-entering")
        });

        it('should throw on double entry of the second participant', async () => {
            let exception;
            try {
                await contract.enter.sendTransaction({ from: accounts[1] });
            }
            catch (ex) {
                exception = ex;
            }
            assert(exception, "Expected an exception to be thrown upon re-entering")
        });
    });
});
