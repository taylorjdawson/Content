const {Block, Transaction} = require('./plasmaObjects.js');
const {validateTransaction, NULL_ADDRESS, decodeUtxoId, encodeUtxoId} = require('./utils.js');

class PlasmaChain {
  constructor(operator, contractAddress, abi, web3) {
    this.events = [];
    
  }
  
  getDepositTx(owner, amount) {
      return new Transaction(0,0,0,0,0,0, owner, amount, NULL_ADDRESS, 0);
  }
}

module.exports = PlasmaChain;