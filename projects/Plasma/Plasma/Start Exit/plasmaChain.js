const { web3JS } = require('./web3Util.js');
const { Block, Transaction } = require('./plasmaObjects.js');
const { validateTransaction, NULL_ADDRESS, decodeUtxoId, encodeUtxoId } = require('./utils.js');

class PlasmaChain {
    constructor(operator, contractAddress, contractAbi, web3 = web3JS) {
        this.operator = operator;
        this.plasmaContract = new web3.eth.Contract(contractAbi, contractAddress);
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
        validateTransaction(tx, this.blocks, this.currentBlock, this.currentBlock.spentUtxos);
        this.currentBlock.transactionSet.push(tx);
        return encodeUtxoId(this.currentBlock.blockNumber, this.currentBlock.transactionSet.length - 1, 0);
    }

    addBlock(block) {
        if (block.blockNumber == this.nextDepositBlock || block.blockNumber == this.nextTxBlock) {
            this.applyBlock(block);

            if (block.blockNumber == this.nextTxBlock) {
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
        const [blkNum, txIndex, oIndex] = decodeUtxoId(utxoId);
        const tx = this.getTransaction(utxoId);
        if (oIndex === 0) {
            tx.spent1 = true;
        } else {
            tx.spent2 = true;
        }
    }

    submitBlock(block) {
        this.addBlock(block);
        const merkle = block.merkle();
        const root = merkle.getRoot();
        return this.plasmaContract.methods.submitBlock(root).send({ from: this.operator }).then(() => {
            this.currentBlock = new Block([], this.nextTxBlock);
        })
    }

    applyTransaction(tx) {
        const { blkNum1, txIndex1, oIndex1, blkNum2, txIndex2, oIndex2 } = tx;
        const inputs = [encodeUtxoId(blkNum1, txIndex1, oIndex1), encodeUtxoId(blkNum2, txIndex2, oIndex2)];
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
        const [blkNum, txIndex, oIndex] = decodeUtxoId(utxoId);
        if (this.blocks[blkNum]) {
            return this.blocks[blkNum].transactionSet[txIndex];
        } else if (this.currentBlock.blockNumber === blkNum) {
            return this.currentBlock.transactionSet[txIndex];
        } else {
            return null;
        }
    }

    getDepositTx(owner, amount) {
        return new Transaction(0, 0, 0, 0, 0, 0, owner, amount, NULL_ADDRESS, 0);
    }
}

module.exports = PlasmaChain;