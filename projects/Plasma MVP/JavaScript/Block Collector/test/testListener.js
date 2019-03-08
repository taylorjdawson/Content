let assert = require('chai').assert;
const { web3, _testAccounts } = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { abi } = require('../Plasma.json');
const PlasmaChain = require('../plasmaChain.js');

describe('PlasmaChain Deposit Watcher', function () {
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
        before(async () => {
            await plasmaChain.plasmaContract.methods.deposit().send({
                from: account1.address,
                value: web3.utils.toWei('1', 'ether')
            });
        });

        it('should have created a block at position 1', () => {
            const block = plasmaChain.blocks[1];
            assert(block, "Did not find a block at position 1");
            assert.equal(block.blockNumber, 1, "blockNumber is not set correctly on block 1");
        });
        
        describe('after a second deposit', () => {
            before(async () => {
                await plasmaChain.plasmaContract.methods.deposit().send({
                    from: account1.address,
                    value: web3.utils.toWei('1', 'ether')
                });
            });

            it('should have created a block at position 2', () => {
                const block = plasmaChain.blocks[2];
                assert(block, "Did not find a block at position 2");
                assert.equal(block.blockNumber, 2, "blockNumber is not set correctly on block 2");
            }); 
        });
    });
});