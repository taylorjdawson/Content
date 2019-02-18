const Buidlathon = artifacts.require('Buidlathon');

contract('Buidlathon', (accounts) => {
  describe('200 max participants', () => {
    let contract;
    let maxParticipants = 200;

    beforeEach(async () => {
      contract = await Buidlathon.new(maxParticipants);
    });

    it('should allow us to retrieve the max participants', async () => {
      const actual = await contract.maxParticipants.call();
      assert.equal(actual.toNumber(), maxParticipants);
    });
  });

  describe('2000 max participants', () => {
    let contract;
    let maxParticipants = 2000;

    beforeEach(async () => {
      contract = await Buidlathon.new(maxParticipants);
    });

    it('should allow us to retrieve the max participants', async () => {
      const actual = await contract.maxParticipants.call();
      assert.equal(actual.toNumber(), maxParticipants);
    });
  });
});
