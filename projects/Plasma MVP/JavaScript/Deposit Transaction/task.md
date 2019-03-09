## Deposit Transaction

OK, so we're listening for `DepositCreated` and we're using it create a block on our operator. 

All that's left to finish this functionality is to add a `Transaction` to our block's `transactionSet`! 

1. To create a transaction make use of the `getDepositTx` function already defined for you in the `PlasmaChain`. This will create a new `Transaction` using the `owner` and `amount` from your event `returnValues`.
2. Once you have created this transaction, add it to your block's `transactionSet`.

> The `getDepositTx` function will transform the deposit into a UTXO formatted transaction.