The function should also confirm that the transaction is a member in the blocks merkle tree.

This can be accomplished by creating a merkle hash from the transaction hash and the signatures passed into the function. This hash will be a `Merkle` tree instance. Then the challenge transaction should be checked for membership of the `Merkle` tree instance.

> Hint: Use the `Merkle` library to check for membership.

If the checks above are passed by the challenging transaction, we have a successful challenge!
