const {web3} = require('./web3Util.js');
const {abi} = require('./Plasma.json');
const {Block, Transaction} = require('./plasmaObjects.js');
const {validateTransaction, NULL_ADDRESS, decodeUtxoId} = require('./utils.js');

class PlasmaChain {
  constructor(operator, contractAddress) {
    this.events = [];
  }
  
  depositListener(self) {
    // Listener logic here
  }
  
  getDepositTx(owner, amount) {
      return new Transaction(0,0,0,0,0,0, owner, amount, NULL_ADDRESS, 0);
  }
}

module.exports = PlasmaChain;