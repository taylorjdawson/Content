let assert = require('assert');
const { web3, _testAccounts } = require('../web3Util.js');
const [operator, account1, account2] = _testAccounts;
const deploy = require('../deployPlasma.js');
const { abi } = require('../Plasma.json');
const { encodeUtxoId } = require('../utils.js');
const PlasmaChain = require('../plasmaChain.js');
const { Transaction, TransactionInput, TransactionOutput } = require('../plasmaObjects.js');
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('apply transaction function', function () {
    let plasmaChain;
    let tx;
    let tx2;
    before(async () => {
        const contract = await deploy(operator.address);
        plasmaChain = new PlasmaChain(operator, contract.options.address, abi, web3);
        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account1.address,
            value: web3.utils.toWei('1', 'ether')
        });
        await plasmaChain.plasmaContract.methods.deposit().send({
            from: account2.address,
            value: web3.utils.toWei('1', 'ether')
        });
        const transferAmount = '10000';
        const ogAmount = '1000000000000000000';
        const leftover = ogAmount - transferAmount;
        tx = new Transaction(
            new TransactionInput(1, 0, 0),
            new TransactionInput(0, 0, 0),
            new TransactionOutput(account2.address, transferAmount),
            new TransactionOutput(account1.address, leftover),
        );
        tx2 = new Transaction(
            new TransactionInput(1000, 0, 1),
            new TransactionInput(0, 0, 0),
            new TransactionOutput(account2.address, transferAmount),
            new TransactionOutput(account1.address, leftover - transferAmount),
        );
    });

    it('should mark the utxo as spent for an outputIndex of 0', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.applyTransaction(tx);
        const utxoId = encodeUtxoId(1, 0, 0);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert.equal(transaction.output1.spent, true);
    });

    it('should mark the utxo as spent for an outputIndex of 1', function () {
        plasmaChain.addTransaction(tx);
        plasmaChain.addTransaction(tx2);
        plasmaChain.applyTransaction(tx2);
        const utxoId = encodeUtxoId(1000, 0, 1);
        const transaction = plasmaChain.getTransaction(utxoId);
        assert.equal(transaction.output2.spent, true);
    });
});