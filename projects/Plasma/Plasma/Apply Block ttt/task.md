## Apply Transaction

Our next function will help to mark all UTXO's of a transaction as spent.

1. Define an `applyTransaction` function with a transaction as it's only argument. 

This function should iterate through the inputs of the transaction and mark that UTXO as spent.

## Apply Block

Finally the function we have been building towards for the past few stages. The purpose of this function is to add a `Block` object to the `blocks` variable.

1. Define an `applyBlock` function with a block as it's only argument.

This function should iterate through the `transactionSet` of the block and invoke the `applyTransaction` function on each transaction. 

Once all block transactions are applied, the block should be added to `blocks` using the `blockNumber` as the object key.