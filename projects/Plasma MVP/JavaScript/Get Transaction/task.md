## Get Transaction

When a transaction is completed successfully we'll need to go back and mark its UTXO inputs as spent so they can't be spent again!

Before we can do that, let's define a helper function to retrieve the transaction.

1. Define a `getTransaction` function with an integer [encoded UTXO ID](?tab=details&scroll=Encoded%20UTXO%20ID) as it's only argument. 
2. Decode the `utxoId` (use the `decodeUtxoId` function from `utils.js`). 
3. Use the decoded `blockNumber`, `transactionIndex` and `outputIndex` values to determine whether the transaction exists or not. If it does, return the transaction. If not return `null`.

> Be sure to check any existing blocks for the UTXO as well as the `currentBlock`. 