let assert = require('chai').assert;
const { web3, _testAccounts } = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { abi } = require('../Plasma.json');
const PlasmaChain = require('../plasmaChain.js');

describe('Plasma Chain Deposit Watcher', function () {
    let plasmaChain;
    before(async () => {
        const contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi, web3);
    });

    it('should store blocks', () => {
        assert(plasmaChain.blocks);
    });

    it('should not have created a block before deposit', () => {
        assert(!plasmaChain.blocks[1]);
        assert(!plasmaChain.blocks[2]);
    });

    describe('after a single deposit', () => {
        let etherDeposited = web3.utils.toWei('1', 'ether');
        before(async () => {
            await plasmaChain.plasmaContract.methods.deposit().send({
                from: account1.address,
                value: etherDeposited,
            });
        });

        it('should have created a block at position 1', () => {
            const block = plasmaChain.blocks[1];
            assert(block, "Did not find a block at position 1");
            assert.equal(block.blockNumber, 1, "blockNumber is not set correctly on block 1");
        });

        it('should have included a transaction in the transaction set', () => {
            const block = plasmaChain.blocks[1];
            const tx = block.transactionSet[0];
            assert(tx, "Did not find a transaction in the blocks transaction set");
            assert.equal(tx.output1.owner, account1.address, "transaction owner was not set properly");
            assert.equal(tx.output1.amount, etherDeposited, "transaction amount was not set properly");
        });
    });
});