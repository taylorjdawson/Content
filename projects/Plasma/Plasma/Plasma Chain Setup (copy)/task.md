## Blocks Object

In order to store our created blocks on the Plasma chain, we need a `blocks` object to store these blocks.

1. Define a `blocks` object in the constructor. 

## Syncing a Deposit

Now that we have an event listener for the `DepositCreated` event, we need to now add that deposit to the Plasma chain.

1. Define an `addDeposit` function with an event as it's only argument

The `addDeposit` function should create a new deposit transaction using the `getDepositTx` function. 

The function should also create a new `Block` based on the deposit transaction then add that block to the `blocks`. The `blockNumber` should point to the `Block` object.

> The `getDepositTx` function will transform the deposit into a UTXO formatted transaction.