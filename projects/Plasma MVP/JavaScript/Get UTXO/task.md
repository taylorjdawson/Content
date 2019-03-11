## Get Transaction

Before we mark a UTXO as spent we need to define a helper function to retrieve the transaction.

1. Define a `getTransaction` function with an encoded `utxoId` as it's only argument. 

The function should decode the `utxoId` then return the related transaction if the transaction exists and return `null` if the transaction does not exist.

> Remember that the transaction could be stored within `blocks`, if the block is already submitted, or `currentBlock` if it has yet to be submitted. 