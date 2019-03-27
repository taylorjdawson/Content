const { Block, Transaction, TransactionInput, TransactionOutput } = require('./plasmaObjects.js');
const { NULL_ADDRESS, decodeUtxoId, encodeUtxoId } = require('./utils.js');

class PlasmaChain {
    constructor(operator, contractAddress, abi, web3) {
        this.operator = operator;
        this.plasmaContract = new web3.eth.Contract(abi, contractAddress);
        this.blocks = {};
        this.blockBuffer = 1000;
        this.nextTxBlock = this.blockBuffer;
        this.currentBlock = new Block([], this.nextTxBlock);

        this.depositListener(this);
    }

    depositListener(self) {
        this.plasmaContract.events.DepositCreated({},
            function (err, event) {
                self.addDeposit(event);
            }
        );
    }

    addDeposit(event) {
        const args = event.returnValues;
        const { owner, amount, blockNumber } = args;
        const deposit = this.getDepositTx(owner, amount);
        this.blocks[blockNumber] = new Block([deposit], blockNumber);
    }

    addTransaction(tx) {
        this.currentBlock.transactionSet.push(tx);
    }

    markUtxoSpent(utxoId) {
        const [blockNumber, transactionIndex, outputIndex] = decodeUtxoId(utxoId);
        const tx = this.getTransaction(utxoId);
        if (outputIndex === 0) {
            tx.output1.spent = true;
        } else {
            tx.output2.spent = true;
        }
    }

    getTransaction(utxoId) {
        const [blockNumber, transactionIndex, outputIndex] = decodeUtxoId(utxoId);
        if(this.blocks[blockNumber]) {
            return this.blocks[blockNumber].transactionSet[transactionIndex];
        } else if(this.currentBlock.blockNumber === blockNumber) {
            return this.currentBlock.transactionSet[transactionIndex];
        } else {
            return null;
        }
    }

    getDepositTx(owner, amount) {
        return new Transaction(undefined, undefined, new TransactionOutput(owner, amount));
    }
}

module.exports = PlasmaChain;
