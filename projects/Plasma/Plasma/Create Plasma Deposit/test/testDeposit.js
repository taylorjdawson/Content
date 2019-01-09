const {sha3} = require("../sha3Util.js");
const Plasma = artifacts.require('Plasma');

contract('Plasma', (accounts) => {
    const owner = accounts[0];

    describe('Deposit', () => {
        let contract;
        let watcher;
        const ether = web3.toWei(1, 'ether');
        beforeEach(async() => {
            contract = await Plasma.new({from: owner})
            watcher = contract.DepositCreated();
            await contract.deposit({from: accounts[1], value: ether})
        })

        it('should deposit funds into the contract', async() => {
            const value = await web3.eth.getBalance(contract.address);
            assert.equal(web3.fromWei(value.toNumber()), 1);
        })

        it('should create a new plasma block and add to the plasma chain', async() => {
            const block = await contract.plasmaChain.call(1);
            const root = block[0];
            assert.equal(root, sha3(accounts[1], parseInt(ether)))
        })

        it('should increment the current deposit block', async() => {
            const counter = await contract.currentDepositBlock.call();
            assert.equal(counter.toNumber(), 2);
        })

        it('should log the deposit', async() => {
            let events = await watcher.get();
            assert.equal(events[0].event, 'DepositCreated');
        })

        // it('should return the plasma block number', async() => {
        //     const block = await contract.deposit({from: accounts[1], value: ether}).call()
        // })
    })
})
