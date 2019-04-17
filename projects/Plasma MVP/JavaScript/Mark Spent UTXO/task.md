## Mark UTXOs as Spent!

Once a transaction is completed we need to go back and mark the UTXO inputs as spent so they cannot be used as an input for another transaction.

1. Within our `PlasmaChain` class, define a `markUtxoSpent` function with an encoded `utxoId` as it's only argument.

2. Decode the `utxoId` to find the specific transaction output that is being referred to.

> Check out the [Encoded UTXO ID](?tab=details&scroll=Encoded%20UTXO%20ID) breakdown if you need a reminder on how the ID integer breaks down into its components.

3. Use the `outputIndex` to determine which output of the transaction. Mark this output as spent by setting it's `spent` attribute to `true`.

> The output will be either `output1` or `output2` based on whether the `outputIndex` is `0` or `1` respectively. The properties `output1` and `output2` are on the `Transaction` instance. The `spent` property is on the `TransactionOutput` instance (`output1` or `output2`). 