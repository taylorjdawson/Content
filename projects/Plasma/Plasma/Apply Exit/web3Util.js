require('events').EventEmitter.defaultMaxListeners = 0;
const Web3 = require('web3');
const web3 = new Web3();
let _testAccounts;
let publicEtherAccount;
(() => {
  const TestRPC = require("ganache-core");
  const publicEtherProps = {
    balance: "100000000000000000000", // 100 ether
    secretKey: web3.utils.randomHex(32)
  };
  const accounts = [].concat([{
    balance: "10000000000000000000", // 10 ether
    secretKey: web3.utils.randomHex(32)
  }, {
    balance: "100000000000000000000", // 100 ether
    secretKey: web3.utils.randomHex(32),
  }, {
  balance: "100000000000000000000", // 100 ether
  secretKey: web3.utils.randomHex(32),
}])
  const provider = TestRPC.provider({ accounts: accounts.concat(publicEtherProps) });
  _testAccounts = accounts.map(({ secretKey }) => web3.eth.accounts.privateKeyToAccount(secretKey));
  publicEtherAccount = web3.eth.accounts.privateKeyToAccount(publicEtherProps.secretKey)
  web3.setProvider(provider);
})();

const GAS = 2000000;
const CHAIN_ID = 10;
const newAddress = () => web3.eth.accounts.create().address;
const accountAddressesSentTo = {}
function signTransaction(account, value, index) {
  return web3.eth.getTransactionCount(account.address).then(count => {
    const nonce = count + index;
    const to = newAddress();
    accountAddressesSentTo[account.address] = (accountAddressesSentTo[account.address] || []).concat(to);
    return account.signTransaction({ to, value, gas: GAS, chainId: CHAIN_ID, nonce })
  });
}

function sendTransaction(tx) {
  return web3.eth.sendSignedTransaction(tx.rawTransaction).catch(console.log)
}

const isFunction = (fn) => typeof fn === 'function'
const isPromiseLike = (obj) => obj && obj.then && isFunction(obj.then);

const web3JS = web3;

module.exports = {
  _testAccounts,
  accountAddressesSentTo,
  isFunction,
  isPromiseLike,
  newAddress,
  web3,
  web3JS,
}