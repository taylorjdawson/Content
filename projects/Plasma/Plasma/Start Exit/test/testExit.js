// const {web3, _testAccounts} = require('../web3Util.js');
// const [operator, account1, account2] = _testAccounts;
// const deploy = require('../deployPlasma.js');
// console.log(web3);
const {Transaction, UnsignedTransaction} = require('../plasmaObjects.js');
const {encodeUtxoId, NULL_ADDRESS} = require('../utils.js');
// // const rlp = require("../rlp.js");
const Plasma = artifacts.require('Plasma');
const PlasmaChain = require('../plasmaChain.js');
// const {sha3} = require('../sha3UtilSol.js');

contract('Plasma', (accounts) => {
    const operator = accounts[0];
    // const ether = web3.toWei('1', 'ether');
    let utxoId;
    let tx;
    let tx2;
    let txBytes;
    let proof;
    let merkle;
    let sigs;
    describe('Priority Queue Function', () => {
        beforeEach(async() => {
            contract = await Plasma.new({from: operator})
            // contract = await deploy(operator.address);
            plasmaChain = new PlasmaChain(operator, contract.address);
            console.log('test')
            // contract.deposit().send({ from: accounts[1], value: ether })

            // await plasmaChain.plasmaContract.methods.deposit().send({from: accounts[1], value: ether})
            
            const transferAmount = '10000';
            const ogAmount = '1000000000000000000';
            const leftover = ogAmount - transferAmount;
            tx = new Transaction(1,0,0,0,0,0, account2.address, transferAmount, account1.address, leftover, NULL_ADDRESS);
            tx2 = new Transaction(1000,0,1,0,0,0, account2.address, transferAmount, account1.address, leftover - transferAmount, NULL_ADDRESS);
            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);
            utxoPos = encodeUtxoId(1000, 1, 0);
            console.log(tx2)
            txBytes = "0x" + tx2.encoded().toString('hex');

            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1]);
            proofBytes = "0x" + proof[0].data.toString('hex');
            sigs = tx2.sig1 + tx2.sig2.slice(2);
        })

        it('should start an exit', async () => {
            
            // await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({from: account2.address, gas: 200000});
        });
        // it('should not allow an invalid exitor to exit the utxo', async () => {
        //     await expectThrow(plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({from: account1.address}));
        // });

        // it('should check for membership of the transaction in the merkle tree', async() => {
        //     const invalidProof = '0x12345';
        //     await expectThrow(plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, invalidProof, sigs).send({from: account2.address, gas: 200000})); 
        // });

        // it('should emit an ExitStarted event', async() => {
        //     await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({from: account2.address, gas: 200000});
        //     let events = await contract.getPastEvents('ExitStarted');
        //     let exit = events[0].event;
        //     assert.equal(exit, 'ExitStarted');
        // })
    })
})

async function expectThrow(promise) {
    const errMsg = 'Expected throw not received';
    try {
        await promise;
    } catch (err) {
        assert(err.toString().includes('revert'), errMsg);
        return;
    }

    assert(false, errMsg);
}