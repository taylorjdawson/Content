const { Block, Transaction, TransactionOutput, TransactionInput } = require('./plasmaObjects.js');
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

    getDepositTx(owner, amount) {
        return new Transaction(undefined, undefined, new TransactionOutput(owner, amount));
    }
}

module.exports = PlasmaChain;
