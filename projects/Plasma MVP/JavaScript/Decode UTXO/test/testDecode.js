const Plasma = artifacts.require('Plasma');
const BLK_ERR = "Wrong Block Number";
const TX_ERR = "Wrong Transaction Index";
const O_ERR = "Wrong Output Index";

contract('Plasma', () => {
    describe('Decode UTXO Function', () => {
        let contract;
        beforeEach(async () => {
            contract = await Plasma.new()
        });

        describe('1:1:1', () => {
            it('should decode UTXO', async () => {
                const [blknum, txindex, oindex] = Object.values(await contract.decodeUTXO(1000010001));
                assert.equal(blknum, 1, BLK_ERR);
                assert.equal(txindex, 1, TX_ERR);
                assert.equal(oindex, 1, O_ERR);
            });
        });

        describe('1000:0:1', () => {
            it('should decode UTXO', async () => {
                const [blknum, txindex, oindex] = Object.values(await contract.decodeUTXO(1000000000001));
                assert.equal(blknum, 1000, BLK_ERR);
                assert.equal(txindex, 0, TX_ERR);
                assert.equal(oindex, 1, O_ERR);
            });
        });

        describe('2000:303:1', () => {
            it('should decode UTXO', async () => {
                const [blknum, txindex, oindex] = Object.values(await contract.decodeUTXO(2000003030001));
                assert.equal(blknum, 2000, BLK_ERR);
                assert.equal(txindex, 303, TX_ERR);
                assert.equal(oindex, 1, O_ERR);
            });
        });
    });
});