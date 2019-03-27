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
        this.nextDepositBlock = 1;

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

        const block = new Block([deposit], blockNumber);
        this.addBlock(block);
    }

    addTransaction(tx) {
        this.currentBlock.transactionSet.push(tx);
        return encodeUtxoId(this.currentBlock.blockNumber, this.currentBlock.transactionSet.length - 1, 0);
    }

    addBlock(block) {
        if(block.blockNumber == this.nextDepositBlock || block.blockNumber == this.nextTxBlock) {
            this.applyBlock(block);

            if(block.blockNumber == this.nextTxBlock) {
                this.nextDepositBlock = this.nextTxBlock + 1;
                this.nextTxBlock += this.blockBuffer;
            } else {
                this.nextDepositBlock += 1;
            }
        } else {
            return false;
        }
    }

    markUtxoSpent(utxoId) {
        const transaction = this.getTransaction(utxoId);
        if (utxoId % 2 === 0) {
            transaction.output1.spent = true;
        }
        else {
            transaction.output2.spent = true;
        }
    }

    applyTransaction(tx) {
        const { input1, input2 } = tx;
        const inputs = [input1.encode(), input2.encode()];
        inputs.forEach(utxoId => {
            if (utxoId === 0) return;
            this.markUtxoSpent(utxoId);
        })
    }

    applyBlock(block) {
        block.transactionSet.forEach(tx => this.applyTransaction(tx));
        this.blocks[block.blockNumber] = block;
    }

    getTransaction(utxoId) {
        const [blockNumber, transactionIndex, outputIndex] = decodeUtxoId(utxoId);
        if (this.blocks[blockNumber]) {
            return this.blocks[blockNumber].transactionSet[transactionIndex];
        } else if (this.currentBlock.blockNumber === blockNumber) {
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
