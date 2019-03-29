## Submit a Block

1. Define a `submitBlock` function with a block as it's only argument. 
2. In this function add the block to the operator's `plasmaChain`.
3. Next we'll need to get the merkle root of this block. We can use the `getMerkleRoot` function which is available on this `block` instance.

> See `PlasmaObjects.js` for the definition of the `getMerkleRoot` function on the `Block` class.

4. Submit the merkle root to our `Plasma.sol` contract, using the function you created two stages ago: `submitBlock`.

> Remember that we are using `web3.js 1.0.0-beta.xx`, you can find the syntax in the [documentation for sending a message and executing a particular method](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#contract-send).

5. Once this message has been successfully broadcasted, create a new `currentBlock` with an empty transaction set.

> This can be done in the callback of the `send` method. If you make use of the `addBlock` function for step 2 the `nextTxBlock` should be set to the right number for you to use for the new `currentBlock`.