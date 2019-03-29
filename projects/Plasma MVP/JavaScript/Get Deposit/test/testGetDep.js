const Plasma = artifacts.require('Plasma');

contract('Plasma', (accounts) => {
    const owner = accounts[0];
    const root = web3.utils.soliditySha3(owner);
    const ether = web3.utils.toWei('1', 'ether');

    beforeEach(async() => {
        contract = await Plasma.new({from: owner});
    });

    it('should set the correct current deposit block', async () => {
        const counter = await contract.currentDepositBlock.call();
        assert.equal(counter.toNumber(), 1);
    });

    it('should set the correct current plasma block', async () => {
        const counter = await contract.currentPlasmaBlock.call();
        assert.equal(counter.toNumber(), 1000);
    });

    describe('after a deposit', () => {
        beforeEach(async() => {
            await contract.deposit({ from: accounts[1], value: ether });
        });

        it('should emit the correct block number', async () => {
            let events = await contract.getPastEvents('DepositCreated');
            const blockNumber = events[0].args.blockNumber;
            assert.equal(blockNumber.toNumber(), 1);
        });

        it('should set the correct current deposit block', async () => {
            const counter = await contract.currentDepositBlock.call();
            assert.equal(counter.toNumber(), 2);
        });

        describe('after a submit', () => {
            beforeEach(async () => {
                await contract.submitBlock(root, { from: owner });
            });

            it('should set the correct current deposit block', async () => {
                const counter = await contract.currentDepositBlock.call();
                assert.equal(counter.toNumber(), 1);
            });

            it('should set the correct current plasma block', async () => {
                const counter = await contract.currentPlasmaBlock.call();
                assert.equal(counter.toNumber(), 2000);
            });

            describe('after two deposits', () => {
                beforeEach(async () => {
                    await contract.deposit({ from: accounts[1], value: ether });
                    await contract.deposit({ from: accounts[1], value: ether });
                });

                it('should emit the correct block number', async () => {
                    let events = await contract.getPastEvents('DepositCreated');
                    const blockNumber = events[0].args.blockNumber;
                    assert.equal(blockNumber.toNumber(), 1002);
                });

                it('should set the correct current deposit block', async () => {
                    const counter = await contract.currentDepositBlock.call();
                    assert.equal(counter.toNumber(), 3);
                });

                it('should set the correct current plasma block', async () => {
                    const counter = await contract.currentPlasmaBlock.call();
                    assert.equal(counter.toNumber(), 2000);
                });
            });
        });
    });
});