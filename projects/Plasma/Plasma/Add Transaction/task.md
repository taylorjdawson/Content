## Transaction Setup

Before we move onto adding Plasma transactions to the Plasma chain, we need to define a few attributes on our Plasma chain.

1. Define a `blockBuffer` of `1000` in the constructor

2. Define a `nextTxBlock` that initializes to the `blockBuffer` in the constructor

3. Define a `currentBlock` that is assigned to a new `Block` with arguments of an empty `transactionSet` and `blockNumber` of the `nextTxBlock`


## Plasma Transaction

Plasma transactions are defined as transactions that occur within the Plasma chain which are separate from deposit transactions.

1. Define an `addTransaction` function with a transaction as its only argument and return an encoded UTXO ID. 

The function should validate the transaction then add the transaction to the `currentBlock`.

Use the `encodeUtxoId` function within `utils.js` to return an encoded UTXO ID. The returned ID can later be used to extract the position of the specific transaction within the chain. As such, the output index does affect how we will use the returned UTXO ID and can be set to 0, or whatever value you heart desires.

