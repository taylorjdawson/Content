const Plasma = artifacts.require('Plasma');

contract('Plasma', (accounts) => {
    const owner = accounts[0];

    describe('Deposit', () => {
        let contract;
        let watcher;
        const ether = web3.utils.toWei('1', 'ether');
        beforeEach(async() => {
            contract = await Plasma.new({from: owner})
            
            await contract.deposit({from: accounts[1], value: ether})
        })

        it('should create a new plasma block and add to the plasma chain', async () => {
            const block = await contract.plasmaChain.call(1);
            const root = block[0];
            assert.equal(root, web3.utils.soliditySha3(accounts[1], parseInt(ether)))
        })

        it('should deposit funds into the contract', async () => {
            const value = await web3.eth.getBalance(contract.address);
            assert.equal(web3.utils.fromWei(value), 1);
        })

        it('should increment the current deposit block', async () => {
            const counter = await contract.currentDepositBlock.call();
            assert.equal(counter.toNumber(), 2);
        })

        it('should log the deposit', async() => {
            let events = await contract.getPastEvents('DepositCreated')
            assert.equal(events[0].event, 'DepositCreated');
        })

        it('should log the owner', async () => {
            let events = await contract.getPastEvents('DepositCreated')
            assert.equal(events[0].args.owner, accounts[1]);
        })

        it('should log the deposit amount', async () => {
            let events = await contract.getPastEvents('DepositCreated')
            assert.equal(web3.utils.fromWei(events[0].args.amount), 1);
        })

        it('should log the corresponding deposit block', async() => {
            let events = await contract.getPastEvents('DepositCreated')
            assert.equal(events[0].args.blockNumber.toNumber(), 1);
        })
    })
})