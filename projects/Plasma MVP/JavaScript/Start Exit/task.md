## Start Exit 

It's time to write the function that will allow anyone to exit the plasma chain with proof that they own their ETH. 

>This is the primary security measure for our Plasma construction, so it's important we get it right! 

1. Define a public payable `startExit` function with a `uint256` utxo position, RLP encoded transaction in `bytes`, merkle proof in `bytes`, and signatures in `bytes`. 

2. This function should decode the UTXO position and retrieve the block number, transaction index, and output index. Let's use the `decodeUTXO` function from the previous stage!

3. Next, we'll need to create an exiting transaction using the `PlasmaRLP` library. This will return us our exitor and exitor amount. 

4. Lastly, invoke the `addExitToQueue` function using the UTXO position, exitor and exitor amount. 