1. Define a public `challengeExit` function with a challenging UTXO position, exiting UTXO index, exiting transaction in bytes, the proof proving the challenging transaction, signatures of the transaction, and a confirmation signature.

The function should create a confirmation hash from the transaction hash and block root.

Then the function should require the owner address located at the exit UTXO position within `exits` to be equal to the recovered address from the confirmation hash created above and the confirmation signature passed into the function.

> Use the `ECRecovery` library to for this check.

The function should also check that the transaction is included in the merkle tree. 

This can be accomplished by created a merkle hash from the transaction hash and the signatures passed into the function then checking the challenging transactions membership within the tree.

> Use the `Merkle` library to check for membership of the tree.

If the checks above are passed by the challenging transaction, we have a successful challenge!

At this point, you should finish the function by removing the `exitor` from the specific `Exit` within `exits`. The transferring the `EXIT_BOND` stored in the contract to the challenger's address.