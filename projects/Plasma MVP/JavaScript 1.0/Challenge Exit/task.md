## A New Challenger Approaches!

Our Plasma user just started their exit from the Plasma chain, however, another user has been monitoring exited Plasma transactions and believes the exited UTXO has already been spent. 

In this case, a user can challenge an exit and be rewarded for a successfuly challenge.

1. Define a public `challengeExit` function with a challenging UTXO position, exiting UTXO index, exiting transaction in `bytes`, the proof proving the challenging transaction, signatures of the transaction, and a confirmation signature.

The function should create a confirmation hash from the transaction hash and block root.

The function should then require the owner address located at the exit UTXO position within `exits` to be equal to the recovered address, from the confirmation hash created above, and the confirmation signature passed into the function.

> Hint: Use the `ECRecovery` library to `recover` the appropriate address.

The function should also confirm that the transaction is a member in the blocks merkle tree.

This can be accomplished by creating a merkle hash from the transaction hash and the signatures passed into the function. This hash will be a `Merkle` tree instance. Then the challenge transaction should be checked for membership of the `Merkle` tree instance.

> Hint: Use the `Merkle` library to check for membership.

If the checks above are passed by the challenging transaction, we have a successful challenge!

At this point, you should finish the function by removing the `exitor` from the specific `Exit` within `exits` and transferring the `EXIT_BOND` stored in the contract to the challenger's address.