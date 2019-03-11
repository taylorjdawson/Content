## Mark UTXO

After a UTXO is spent within we need to make sure it is marked as spent so it cannot be used as an input for another transaction. Our `validateTransaction` function within the `utils.js` file will help us validate if a UTXO has already been spent.

2. Define a `markUtxoSpent` function with an encoded `utxoId` as it's only argument. 

The function should decode the `utxoId`, get the related transaction and then assign the related `spent` attribute to `true` based on the `oIndex` of the transaction.