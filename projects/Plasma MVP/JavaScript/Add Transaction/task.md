## Transaction Setup

OK, it's just about time to add some transactions to our Plasma Chain! 

First, let's define a few member variables in our class. 

1. Define a member variable `blockBuffer` of `1000` in the constructor

2. Define a member variable `nextTxBlock` that initializes at the `blockBuffer` value in the constructor

3. Define a `currentBlock` that is assigned to a new `Block` with arguments of an empty array (for `transactionSet`) and `blockNumber` of the `nextTxBlock`


## Add Transactions!

Plasma transactions are transactions that occur within the Plasma chain. Think of these as being separate from deposit transactions.

1. Define an `addTransaction` function which takes an instance of `Transaction` as its only argument.
2. Add the transaction to the current block's `transactionSet`.
2. Use the transaction properties and return an [encoded UTXO ID](?tab=details&scroll=Encoded%20UTXO%20ID).

The function should validate the transaction then add the transaction to the `currentBlock`.

Use the `encodeUtxoId` function within `utils.js` to return an encoded UTXO ID. The returned ID can later be used to extract the position of the specific transaction within the chain. As such, the output index does affect how we will use the returned UTXO ID and can be set to 0, or whatever value you heart desires.

