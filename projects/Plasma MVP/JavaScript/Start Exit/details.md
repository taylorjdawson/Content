## Plasma RLP Library

In order to send more complex data structures up to our Solidity contract, we can use [RLP Encoding/Decoding](https://github.com/ethereum/wiki/wiki/RLP#rlp-decoding). 

We can encode our exiting transaction on the client and then send that up as a single `bytes` parameter. Then, in our contract we can use `RLPDecode.sol` to decode that structure. 

The `PlasmaRLP.sol` library has already been set up for you, so you can use it's `createExitingTx` method to get a `PlasmaRLP.exitingTx`, which will contain the exiting transaction owner and amount. 

> You'll be able to access the `PlasmaRLP.exitingTx` struct as well as the `createExitingTx` method once you have imported `PlasmaRLP.sol`.