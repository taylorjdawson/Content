## Merkle Membership

Remember, in order to challenge the exit properly the challenger needs to provide proof that the UTXO was spent in another transaction. 

Since the Plasma operator only submits merkle roots, the proof must be a set of operations that includes the UTXO and results in the root of that particular block.

## Validation

The function should also confirm that the transaction is a member in the blocks merkle tree.

This can be accomplished by creating a merkle hash from the transaction hash and the signatures passed into the function. This hash will be a `Merkle` tree instance. Then the challenge transaction should be checked for membership of the `Merkle` tree instance.

> Hint: Use the `Merkle` library to check for membership.

If the checks above are passed by the challenging transaction, we have a successful challenge!
