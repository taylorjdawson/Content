Now that we have the ability to add an exit to the `PriorityQueue`, we need to create that exit transaction and check for its inclusion in the block's merkle tree. But first let's create an `EXIT_BOND`.

## Exit Bond

1. Define an `EXIT_BOND` public constant.

An exit bond is attached to an exit as a retainer against the good faith of the exitor. In this way, if an exitor attempts to exit an invalid transaction and it is successfully challenged by another party, the exit would be revoked, the exitor would lose their exit bond, and the challenger would win the exit bond.

## Start Exit 

1. Define a public payable `startExit` function with a `uint256` utxo position, RLP encoded transaction in `bytes`, merkle proof in `bytes`, and signatures in `bytes`. 

The function should revert if the value sent to the function is not equal to the `EXIT_BOND` value.

This function should decode the UTXO position and retrieve the block number, transaction index, and output index. 

Next, the function should create an exiting transaction using the `PlasmaRLP` library. The function should revert if the `exitor` in our exiting transaction is not equal to the sender.

Next, we need to check for membership of the merkle hash within the block's merkle tree using our `Merkle` library and revert if the hash in not included.

Lastly, invoke the `addExitToQueue` function.

> UTXO Decoding: The logic for decoding is exactly the same as the `decodeUtxoId` function within the `utils.js` file found in previous `PlasmaChain` stages.