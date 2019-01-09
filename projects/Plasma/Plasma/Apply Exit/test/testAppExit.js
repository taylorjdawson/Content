const {web3, _testAccounts} = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const {Transaction, UnsignedTransaction} = require('../plasmaObjects.js');
const {encodeUtxoId, NULL_ADDRESS} = require('../utils.js');
const Plasma = artifacts.require('Plasma');
const PlasmaChain = require('../plasmaChain.js');

contract('Plasma', (accounts) => {
    const ether = web3.utils.toWei('1', 'ether');
    let utxoId;
    let tx;
    let tx2;
    let txBytes;
    let proof;
    let merkle;
    let sigs;
    describe('Priority Queue Function', () => {
        // MIGHT WANT TO PULL EXIT BOND VALUE FROM CONTRACT INSTEAD OF HARDCODING
        beforeEach(async() => {
            contract = await deploy(operator.address);
            plasmaChain = new PlasmaChain(operator, contract.options.address);
            await plasmaChain.plasmaContract.methods.deposit().send({from: account1.address, value: ether})
            const transferAmount = '10000';
            const ogAmount = '1000000000000000000';
            const leftover = ogAmount - transferAmount;
            tx = new Transaction(1,0,0,0,0,0, account2.address, transferAmount, account1.address, leftover, NULL_ADDRESS);
            tx2 = new Transaction(1000,0,1,0,0,0, account2.address, transferAmount, account1.address, leftover - transferAmount, NULL_ADDRESS);
            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);
            utxoPos = encodeUtxoId(1000, 1, 0);
            txBytes = "0x" + tx2.encoded().toString('hex');
            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1]);
            proofBytes = "0x" + proof[0].data.toString('hex');
            sigs = tx2.sig1 + tx2.sig2.slice(2);
            await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({from: account2.address, gas: 200000, value: 1000});
        })

        it('should mark the UTXO as spent', async () => {
            const tx = plasmaChain.getTransaction(utxoPos);
            assert.equal(tx.spent1, true);
        });
    })
})