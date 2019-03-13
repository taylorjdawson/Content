const {Block, Transaction, TransactionOutput, TransactionInput} = require('./plasmaObjects.js');
const {NULL_ADDRESS, decodeUtxoId, encodeUtxoId} = require('./utils.js');

class PlasmaChain {
  constructor(operator, contractAddress, abi, web3) {

  }

  getDepositTx(owner, amount) {
    return new Transaction(undefined, undefined, new TransactionOutput(owner, amount));
  }
}

module.exports = PlasmaChain;
