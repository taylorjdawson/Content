## Start Exit 

Users need to be able to withdraw their funds from the plasma chain (referred to as “exiting” the chain). When users want to withdraw from the plasma chain, they submit an exit transaction on Ethereum. 

Let's write this functionality into a function called `startExit`. Check out a [visual construction](?tab=details?scroll=Start%20Exit%20Visually) for an easy view of this function. 

> This is the primary security measure for our Plasma construction, so it's important we get it right! 

1. Define a public payable `startExit` function with a `uint256` utxo position, RLP encoded transaction in `bytes`, [merkle proof](?tab=details&scroll=Merkle%20Proof) in `bytes`, and signatures in `bytes`. 

2. This function should decode the UTXO position and retrieve the block number, transaction index, and output index. Let's use the `decodeUTXO` function from the previous stage!

3. Next, we'll need to create an exiting transaction using the [`PlasmaRLP` library](?tab=details&scroll=Plasma%20RLP%20Library). The `createExitingTx` will return an `exitingTx` with our exitor and exit amount. 

4. Lastly, invoke the `addExitToQueue` function using the UTXO position, exitor and exit amount. 