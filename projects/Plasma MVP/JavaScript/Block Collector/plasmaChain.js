const { Block, Transaction, TransactionInput, TransactionOutput } = require('./plasmaObjects.js');
const { NULL_ADDRESS, decodeUtxoId } = require('./utils.js');

class PlasmaChain {
    constructor(operator, contractAddress, abi, web3) {
        this.blocks = [];
        this.operator = operator;
        this.plasmaContract = new web3.eth.Contract(abi, contractAddress);

        this.depositListener();
    }

    depositListener() {
        this.plasmaContract.events.DepositCreated({},
            (err, event) => {
                const { returnValues: { blockNumber }} = event;
                this.blocks[blockNumber] = new Block([], blockNumber);
            }
        );
    }
}

module.exports = PlasmaChain;
