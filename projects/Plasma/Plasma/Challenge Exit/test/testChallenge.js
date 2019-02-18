const { web3, _testAccounts } = require('../js/web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../js/deployPlasma.js');
const { Transaction } = require('../js/plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS } = require('../js/utils.js');
const Plasma = artifacts.require('Plasma');
const PlasmaChain = require('../plasmaChain.js');
const Web3Utils = require('web3-utils');

contract('Plasma', (accounts) => {
    const ether = web3.utils.toWei('1', 'ether');
    let utxoId;
    let tx;
    let tx2;
    let cTx;
    let txBytes;
    let cTxBytes;
    let proof;
    let cProof;
    let merkle;
    let cMerkle;
    let confirmationHash;
    let cSigs;
    let cConfSig;
    let sigs;
    describe('Start Exit Function', () => {
        // MIGHT WANT TO PULL EXIT BOND VALUE FROM CONTRACT INSTEAD OF HARDCODING
        beforeEach(async () => {
            contract = await deploy(operator.address);
            plasmaChain = new PlasmaChain(operator, contract.options.address);

            await plasmaChain.plasmaContract.methods.deposit().send({ from: account1.address, value: ether })
            const transferAmount = '10000';
            const ogAmount = '1000000000000000000';
            const leftover1 = ogAmount - transferAmount;
            const leftover2 = leftover1 - transferAmount;

            tx = new Transaction(1, 0, 0, 0, 0, 0,
                account2.address, transferAmount,
                account1.address, leftover1,
                NULL_ADDRESS);

            tx2 = new Transaction(1000, 0, 1, 0, 0, 0,
                account2.address, transferAmount,
                account1.address, leftover2,
                NULL_ADDRESS);

            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);

            utxoPos = encodeUtxoId(1000, 1, 0);
            await tx2.sign1(account1.privateKey);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);


            // Exiting Transaction @ Block 1000
            txBytes = "0x" + tx2.encoded().toString('hex');
            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1]);
            proofBytes = "0x" + proof[0].data.toString('hex');
            confirmationSig = tx2.confirm(merkle.getRoot(), account1.privateKey);
            sigs = tx2.sig1 + tx2.sig2.slice(2) + confirmationSig;

            // Challenging Transaction @ Block 2000
            cTx = new Transaction(1000, 1, 0, 0, 0, 0,
                account2.address, transferAmount,
                account1.address, leftover2 - transferAmount,
                NULL_ADDRESS);

            plasmaChain.addTransaction(cTx);

            cUtxoPos = encodeUtxoId(2000, 0, 0);
            await cTx.sign1(account2.privateKey);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);

            cTxBytes = "0x" + cTx.encoded().toString('hex');
            cMerkle = plasmaChain.blocks[2000].merkle();
            cConfSig = cTx.confirm(cMerkle.getRoot(), account2.privateKey);
            cSigs = cTx.sig1 + cTx.sig2.slice(2);

            await plasmaChain.plasmaContract.methods.startExit(utxoPos, txBytes, proofBytes, sigs).send({ from: account2.address, gas: 200000, value: 1000000000000000000 });
        })

        it('should revert if the exitor address does not match the recovered public key of the confirmation hash and confirmation signature', async () => {
            await expectThrow(plasmaChain.plasmaContract.methods.challengeExit(cUtxoPos, 0, cTxBytes, "0x", cSigs, "0x" + confirmationSig).send({ from: account1.address, gas: 200000 }));
        });

        it('should revert if the challenging transaction is not included within the blocks merkle tree', async () => {
            await expectThrow(plasmaChain.plasmaContract.methods.challengeExit(cUtxoPos, 0, cTxBytes, proofBytes, cSigs, "0x" + cConfSig).send({ from: account1.address, gas: 200000 }));
        });

        it('should delete the exitor from the exit mapped to the exiting UTXO position', async () => {
            await plasmaChain.plasmaContract.methods.challengeExit(cUtxoPos, 0, cTxBytes, "0x", cSigs, "0x" + cConfSig).send({ from: account1.address, gas: 200000 });
            const exitor = await plasmaChain.plasmaContract.methods.exits(utxoPos).call();

            assert.equal(exitor.exitor, NULL_ADDRESS)
        });

        it('should transfer the exit bond to the challenger upon sucessful challenge', async () => {
            const begBalance = await web3.eth.getBalance(account1.address);
            const tx = await plasmaChain.plasmaContract.methods.challengeExit(cUtxoPos, 0, cTxBytes, "0x", cSigs, "0x" + cConfSig).send({ from: account1.address, gas: 200000 });

            const exitBond = await plasmaChain.plasmaContract.methods.EXIT_BOND().call();
            const gasP = await web3.eth.getGasPrice();
            const gasCost = tx.gasUsed * gasP;
            const expectedChange = Web3Utils.toBN(exitBond).sub(Web3Utils.toBN(gasCost))

            const newBalance = await web3.eth.getBalance(account1.address);
            const totalChange = Web3Utils.toBN(newBalance).sub(Web3Utils.toBN(begBalance));

            assert.equal(expectedChange.toString(), totalChange.toString());
        });
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