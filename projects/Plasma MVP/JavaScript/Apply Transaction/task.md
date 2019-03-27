## Apply Transaction

Our next function will help to mark all spent UTXO's within a transaction.

1. Define an `applyTransaction` function with a transaction as it's only argument. 

This function should iterate through the UTXO's spent as inputs within the transaction and mark those UTXO's as spent.

While iterating through the inputs, it's important to skip iteration for any inputs that refer to a block number of `0`. This is because when a deposit transaction is created on the Plasma chain there is no UTXO to refer to for the input of that transaction. Therefore a new UTXO is created "out of thin air" or from block `0`.