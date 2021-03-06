## Merkle Membership

Remember, in order to challenge the exit properly the challenger needs to provide proof that the UTXO was spent in another transaction. 

Since the Plasma operator only submits merkle roots, the proof must be a set of operations that includes the UTXO and results in the root of that particular block.

## Validation

The function should also confirm that the transaction is a member in the blocks merkle tree.

1. Create a Merkle Hash like you did in `startExit`. It should be a hash of the transaction hash and the signatures. 

2. Similar to `startExit` use the merkle hash, transaction index and proof to ensure this transaction exists within the merkle root. 

If the checks above are passed by the challenging transaction, we have a successful challenge!
