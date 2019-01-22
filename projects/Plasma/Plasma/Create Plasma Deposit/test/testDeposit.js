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
            
            await contract.deposit({from: accounts[1], value: ether})
        })

        it('should create a new plasma block and add to the plasma chain', async () => {
            const block = await contract.plasmaChain.call(1);
            const root = block[0];
            assert.equal(root, sha3(accounts[1], parseInt(ether)))
        })

        it('should deposit funds into the contract', async () => {
            const value = await web3.eth.getBalance(contract.address);
            assert.equal(web3.fromWei(value.toNumber()), 1);
        })

        it('should increment the current deposit block', async () => {
            const counter = await contract.currentDepositBlock.call();
            assert.equal(counter.toNumber(), 2);
        })

        it('should log the deposit', async() => {
            watcher = contract.DepositCreated();
            let events = await Promisify(cb => watcher.get(cb));
            assert.equal(events[0].event, 'DepositCreated');
        })

        it('should log the owner', async () => {
            watcher = contract.DepositCreated();
            let events = await Promisify(cb => watcher.get(cb));
            assert.equal(events[0].args.owner, accounts[1]);
        })

        it('should log the deposit amount', async () => {
            watcher = contract.DepositCreated();
            let events = await Promisify(cb => watcher.get(cb));
            console.log()
            assert.equal(web3.fromWei(events[0].args.amount.toNumber()), 1);
        })

        it('should log the corresponding deposit block', async() => {
            watcher = contract.DepositCreated();
            let events = await Promisify(cb => watcher.get(cb));
            assert.equal(events[0].args.blockNumber.toNumber(), 1);
        })

       

        
    })
})

const Promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );
