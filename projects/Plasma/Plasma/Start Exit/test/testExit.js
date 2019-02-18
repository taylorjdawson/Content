const { web3, _testAccounts } = require('../web3Util.js');
// console.log(web3)
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { Transaction, UnsignedTransaction } = require('../plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS, NULL_SIGNATURE } = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');

describe('Start Exit Function', () => {
    const ether = web3.utils.toWei('1', 'ether');
    let utxoId;
    let tx;
    let tx2;
    let txBytes;
    let proof;
    let merkle;
    let confirmationHash;
    let sigs;
    beforeEach(async () => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator.address, contract.options.address);

        await plasmaChain.plasmaContract.methods.deposit().send({ from: account1.address, value: ether })
        const transferAmount = 10000;
        const ogAmount = 1000000000000000000;
        const leftover = ogAmount - transferAmount;

        tx = new Transaction(1, 0, 0, 0, 0, 0,
            account2.address, transferAmount,
            account1.address, leftover,
            NULL_ADDRESS);

        tx2 = new Transaction(1000, 0, 1, 0, 0, 0,
            account2.address, transferAmount,
            account1.address, leftover - transferAmount,
            NULL_ADDRESS);

        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);

        await tx2.sign1(account1.privateKey);
        await plasmaChain.submitBlock(plasmaChain.currentBlock);

        utxoPos = encodeUtxoId(1000, 1, 0);
        txBytes = "0x" + tx2.encoded().toString('hex');
        merkle = plasmaChain.blocks[1000].merkle();
        proof = merkle.getProof(merkle.leaves[1]);
        proofBytes = "0x" + proof[0].data.toString('hex');
        confirmationSig = tx2.confirm(merkle.getRoot(), account1.privateKey);
        sigs = tx2.sig1 + tx2.sig2.slice(2) + confirmationSig;

        bond = await plasmaChain.plasmaContract.methods.EXIT_BOND().call();
    })

    it('should start an exit', async () => {
        await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: bond });
    });

    it('should revert if the value sent is not equal to the exit bond', async () => {
        await expectThrow(plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: 500 }));
    })

    it('should not allow an invalid exitor to exit the utxo', async () => {
        await expectThrow(plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account1.address, value: bond }));
    });

    it('should check for membership of the transaction in the merkle tree', async () => {
        const invalidProof = '0x12345';
        await expectThrow(plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, invalidProof, sigs).send({ from: account2.address, gas: 200000, value: bond }));
    });

    it('should check that the signatures are valid', async () => {
        confirmationSig = tx2.confirm(merkle.getRoot(), account2.privateKey);
        sigs = tx2.sig1 + tx2.sig2.slice(2) + confirmationSig;

        await expectThrow(plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: bond }));
    });

    it('should emit an ExitStarted event', async () => {
        await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: bond });

        let events = await contract.getPastEvents('ExitStarted');
        let exit = events[0].event;

        assert.equal(exit, 'ExitStarted');
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
