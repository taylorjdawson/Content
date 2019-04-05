const { Transaction, TransactionInput, TransactionOutput } = require('../plasmaObjects.js');
const { encodeUtxoId, NULL_ADDRESS } = require('../utils.js');
const { privateKeyOperator, privateKey1, privateKey2 } = require("../privateKeys.js");
const Plasma = artifacts.require('Plasma');
const PlasmaChain = require('../plasmaChain.js');
web3.setProvider(new web3.providers.WebsocketProvider('http://127.0.0.1:7545/'));
const PW = 'password1234';

// Challenge Exit => Stage 16
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
    let bond;
    describe('Start Exit Function', () => {
        beforeEach(async () => {
            operator = await web3.eth.personal.importRawKey(privateKeyOperator, PW);
            address1 = await web3.eth.personal.importRawKey(privateKey1, PW);
            address2 = await web3.eth.personal.importRawKey(privateKey2, PW);
            // use that password to unlock the account so truffle can use it
            await web3.eth.personal.unlockAccount(operator, PW, 6000);
            await web3.eth.personal.unlockAccount(address1, PW, 6000);
            await web3.eth.personal.unlockAccount(address2, PW, 6000);

            // give our new account some ether from an already loaded account
            await web3.eth.sendTransaction({ from: accounts[0], to: operator, value: web3.utils.toWei("1") })
            await web3.eth.sendTransaction({ from: accounts[1], to: address1, value: web3.utils.toWei("2") })
            await web3.eth.sendTransaction({ from: accounts[2], to: address2, value: web3.utils.toWei("2") })

            contract = await Plasma.new({ from: operator })
            plasmaChain = new PlasmaChain(operator, contract.address, contract.abi, web3);

            await contract.deposit({ from: address1, value: ether })
            const transferAmount = '10000';
            const ogAmount = '1000000000000000000';
            const leftover1 = ogAmount - transferAmount;
            const leftover2 = leftover1 - transferAmount;

            tx = new Transaction(
                new TransactionInput(1, 0, 0),
                new TransactionInput(0, 0, 0),
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover1),
            );

            tx2 = new Transaction(
                new TransactionInput(1000, 0, 1),
                new TransactionInput(0, 0, 0),
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover2),
            );

            plasmaChain.addTransaction(tx);
            plasmaChain.addTransaction(tx2);

            utxoPos = encodeUtxoId(1000, 1, 0);
            await tx2.sign1(privateKey1);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);


            // Exiting Transaction @ Block 1000
            txBytes = "0x" + tx2.encoded().toString('hex');
            merkle = plasmaChain.blocks[1000].merkle();
            proof = merkle.getProof(merkle.leaves[1]);
            proofBytes = "0x" + proof[0].data.toString('hex');
            confirmationSig = tx2.confirm(merkle.getRoot(), privateKey1);
            sigs = tx2.input1.signature + tx2.input2.signature.slice(2) + confirmationSig;

            cTx = new Transaction(
                new TransactionInput(1000, 1, 0),
                new TransactionInput(0, 0, 0),
                new TransactionOutput(address2, transferAmount),
                new TransactionOutput(address1, leftover2 - transferAmount),
            );

            plasmaChain.addTransaction(cTx);

            cUtxoPos = encodeUtxoId(2000, 0, 0);
            await cTx.sign1(privateKey2);
            await plasmaChain.submitBlock(plasmaChain.currentBlock);

            cTxBytes = "0x" + cTx.encoded().toString('hex');
            cMerkle = plasmaChain.blocks[2000].merkle();
            cConfSig = cTx.confirm(cMerkle.getRoot(), privateKey2);
            cSigs = cTx.input1.signature + cTx.input2.signature.slice(2);

            bond = await contract.EXIT_BOND();
            await contract.startExit(utxoPos, txBytes, proofBytes, sigs, { from: address2, gas: 200000, value: bond })
        })

        it('should revert if the exitor address does not match the recovered public key of the confirmation hash and confirmation signature', async () => {
            await expectThrow(contract.challengeExit(cUtxoPos, 0, cTxBytes, "0x", cSigs, "0x" + confirmationSig, { from: address1, gas: 200000 }));
        });

        it('should delete the exitor from the exit mapped to the exiting UTXO position', async () => {
            await contract.challengeExit(cUtxoPos, 0, cTxBytes, "0x", cSigs, "0x" + cConfSig, { from: address1, gas: 200000 })
            const exitor = await contract.exits(utxoPos);
            assert.equal(exitor.exitor, NULL_ADDRESS);
        });

        it('should transfer the exit bond to the challenger upon sucessful challenge', async () => {
            const begBalance = await web3.eth.getBalance(address1);
            const gasP = await web3.eth.getGasPrice();
            const tx = await contract.challengeExit(cUtxoPos, 0, cTxBytes, "0x", cSigs, "0x" + cConfSig, { from: address1, gas: 200000, gasPrice: gasP })
            const gasCost = web3.utils.toBN(tx.receipt.gasUsed).mul(web3.utils.toBN(gasP));
            const expectedChange = web3.utils.toBN(bond).sub(web3.utils.toBN(gasCost))

            const newBalance = await web3.eth.getBalance(address1);
            const totalChange = web3.utils.toBN(newBalance).sub(web3.utils.toBN(begBalance))
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
