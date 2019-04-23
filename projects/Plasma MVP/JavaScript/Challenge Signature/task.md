## Validating Signatures

Okay, now it's time to implement some security on our `challengeExit` function! 

First let's ensure that the exitor (the address attempting to exit) is the same as the one that signed the confirmation signature. If so, this will prove that the exitor approved spending the UTXO they are trying to exit with.

1. Create a confirmation hash using the hash of the transaction bytes and root hash of the challenging block.

> To find the challenging block, you can decode the challenging UTXO position and use the block number to lookup the block in the plasma chain. Then you can also access it's merkle root hash.

2. Ensure that the `exitor` address (the one to be deleted upon successful challenge) is the same as the address that confirmed the transaction in question. 

> Hint: Use the `ECRecovery` library to `recover` the address from the confirmation hash. You'll be able to pass in the confirmation hash from step 1 as well as the confirmation signature from the function arguments. Compare this address to the `exitor` address. Revert if they are not the same.