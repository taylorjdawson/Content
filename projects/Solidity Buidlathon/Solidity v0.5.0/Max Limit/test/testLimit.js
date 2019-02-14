const Buidlathon = artifacts.require('Buidlathon');

contract('Buidlathon', (accounts) => {
  describe('One Less than Threshold', () => {
    let contract;

    beforeEach(async () => {
      contract = await Buidlathon.new(5);
      for (let i = 0; i < 4; i++) {
        await contract.enter.sendTransaction({ from: accounts[i] });
      }
    });

    it('should successfully add the participants', async () => {
      const actual = await contract.numberOfParticipants.call();
      assert.equal(actual.toNumber(), 4);
    });
  });
  describe('At the Threshold', () => {
    let contract;

    beforeEach(async () => {
      contract = await Buidlathon.new(5);
      for (let i = 0; i < 5; i++) {
        await contract.enter.sendTransaction({ from: accounts[i] });
      }
    });

    it('should successfully add the participants', async () => {
      const actual = await contract.numberOfParticipants.call();
      assert.equal(actual.toNumber(), 5);
    });

    it('should throw on the next entry', async () => {
      let exception;
      try {
        await contract.enter.sendTransaction({ from: accounts[5] });
      }
      catch(ex) {
        exception = ex;
      }
      assert(exception, "Expected an exception to be thrown upon reaching max participants")
    });
  });
});
