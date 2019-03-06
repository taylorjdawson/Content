const { web3JS } = require('./web3Util.js');
const { Block, Transaction } = require('./plasmaObjects.js');
const { validateTransaction, NULL_ADDRESS, decodeUtxoId } = require('./utils.js');

class PlasmaChain {
    constructor(operator, contractAddress, abi, web3=web3JS) {
        this.operator = operator;
        this.plasmaContract = new web3.eth.Contract(abi, contractAddress);
        this.blocks = {};

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

    getDepositTx(owner, amount) {
        return new Transaction(0, 0, 0, 0, 0, 0, owner, amount, NULL_ADDRESS, 0);
    }
}

module.exports = PlasmaChain;