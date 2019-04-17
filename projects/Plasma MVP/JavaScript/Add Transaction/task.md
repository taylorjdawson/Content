## Transaction Setup

OK, it's just about time to add some **Plasma Transactions** to our Plasma Chain! 

> Plasma transactions are transactions that occur outside of Ethereum. We distinguish them from deposits which originate within our Ethereum Smart Contract (`Plasma.sol`). Unlike deposits, which require an Ethereum transaction for each, plasma transactions can be batched offline. 

To get us started, let's define a few member variables in our class. 

1. Define a member variable `blockBuffer` of `1000` in the constructor

2. Define another member variable `nextTxBlock` that initializes at the same value as the `blockBuffer` 

3. Define one more member variable `currentBlock` that is assigned to a new `Block` with arguments of an empty array (for `transactionSet`) and `blockNumber` of the `nextTxBlock`

## Adding Transactions

Now let's create a function that will allow us to add a transaction to our plasma chain.

1. Within our `PlasmaChain` class, define an `addTransaction` function which takes an instance of `Transaction` as its only argument.

2. Add the transaction to the current block's `transactionSet`.

> Use the `currentBlock` defined in the third step of the Transaction Setup. On the `Block` you can access `transactionSet` as a member variable and simply push the new transaction onto it.
