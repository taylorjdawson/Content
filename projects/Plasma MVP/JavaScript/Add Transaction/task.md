## Transaction Setup

OK, it's just about time to add some transactions to our Plasma Chain! 

First, let's define a few member variables in our class. 

1. Define a member variable `blockBuffer` of `1000` in the constructor

2. Define a member variable `nextTxBlock` that initializes at the `blockBuffer` value in the constructor

3. Define a `currentBlock` that is assigned to a new `Block` with arguments of an empty array (for `transactionSet`) and `blockNumber` of the `nextTxBlock`


## Adding Transactions

Plasma transactions are transactions that occur outside of Ethereum. We distinguish them from deposits which originate within our Ethereum Smart Contract (`Plasma.sol`). 

1. Define an `addTransaction` function which takes an instance of `Transaction` as its only argument.
2. Add the transaction to the current block's `transactionSet`.
