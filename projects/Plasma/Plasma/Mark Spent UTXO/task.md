## Get Transaction

Before we mark a UTXO as spent we need to define a helper function to retrieve the transaction.

1. Define a `getTransaction` function with an encoded `utxoId` as it's only argument. 

The function should decode the `utxoId` then return the related transaction. 

> Remember that the transaction could either be in `blocks`, if the block is already submitted, or `currentBlock` if it has yet to be submitted. 

## Mark UTXO

After a UTXO is spent within we need to make sure it is marked as spent so it cannot be used as an input for another transaction. Our `validateTransaction` function with the `utils.js` file will help our validate if a UTXO has already been spent.

2. Define a `markUtxoSpent` function with an encoded `utxoId` as it's only argument. 

The function should decode the `utxoId`, get the related transaction and then assign the related `spent` attribute to `true` based on the `oIndex` of the transaction.