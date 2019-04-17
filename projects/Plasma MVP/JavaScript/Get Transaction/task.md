## Get Transaction

In this Plasma implementation we will [encode and decode our UTXO ID](?tab=details&scroll=Encoded%20UTXO%20ID) allowing us to easily reference a UTXO from an integer value. 

Let's write a helper function that will take an ecoded UTXO ID and return us a transaction.

1. Define a `getTransaction` function with an integer [encoded UTXO ID](?tab=details&scroll=Encoded%20UTXO%20ID) as it's only argument. 

2. Decode the `utxoId` from it's integer value to get the `blockNumber`, `transactionIndex` and `outputIndex`

> You can use the `decodeUtxoId` function from `utils.js`! 

3. Use the decoded `blockNumber` and `transactionIndex` to determine whether the transaction exists or not. If it does, return the transaction. If not return `null`.

> Be sure to check for the transaction in `blocks` as well as in the `currentBlock`. 