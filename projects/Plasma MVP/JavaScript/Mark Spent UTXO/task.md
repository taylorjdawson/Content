## Mark UTXOs as Spent!

Once a transaction is completed we need to go back and mark the UTXO inputs as spent so they cannot be used as an input for another transaction.

1. Define a `markUtxoSpent` function with an encoded `utxoId` as it's only argument.
2. Use the `utxoId` to find the transaction and then find the specific output. It will be `output1` or `output2` based on whether the `outputIndex` is `0` or `1` respectively. Assign the appropriate output `spent` attribute to `true`.

> Check out the [Encoded UTXO ID](?tab=details&scroll=Encoded%20UTXO%20ID) breakdown if you need a reminder on how the ID integer breaks down into its components.