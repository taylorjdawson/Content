const { assert } = require('chai');
const { web3, _testAccounts } = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { Transaction, TransactionInput, TransactionOutput } = require('../plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS } = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const {abi} = require('../Plasma.json');

describe('Apply Exit Function', () => {
    const ether = web3.utils.toWei('1', 'ether');
    let contract;
    let plasmaChain;
    let utxoPos;
    beforeEach(async () => {
        contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator.address, contract.options.address, abi, web3);
        await plasmaChain.plasmaContract.methods.deposit().send({ from: account1.address, value: ether })

        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;

        const tx = new Transaction(
            new TransactionInput(1, 0, 0),
            new TransactionInput(0, 0, 0),
            new TransactionOutput(account2.address, transferAmount),
            new TransactionOutput(account1.address, leftover),
        );

        const tx2 = new Transaction(
            new TransactionInput(1000, 0, 1),
            new TransactionInput(0, 0, 0),
            new TransactionOutput(account2.address, transferAmount),
            new TransactionOutput(account1.address, leftover - transferAmount),
        );

        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        await tx2.sign1(account1.privateKey);

        await plasmaChain.submitBlock(plasmaChain.currentBlock);

        utxoPos = encodeUtxoId(1000, 1, 0);
        const txBytes = "0x" + tx2.encoded().toString('hex');
        const merkle = plasmaChain.blocks[1000].merkle();
        const proof = merkle.getProof(merkle.leaves[1]);
        const proofBytes = "0x" + proof[0].data.toString('hex');

        const confirmationSig = tx2.confirm(merkle.getRoot(), account1.privateKey);
        const sigs = tx2.input1.signature + tx2.input2.signature.slice(2) + confirmationSig;
        const bond = await plasmaChain.plasmaContract.methods.EXIT_BOND().call();

        await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: bond });
    })

    it('should mark the UTXO as spent', function () {
        const tx = plasmaChain.getTransaction(utxoPos);
        assert.equal(tx.output1.spent, true);
    });
})
