## Apply Transaction

Our next function will help to mark all spent UTXO's within a transaction.

1. Define an `applyTransaction` function with a transaction as it's only argument. 

2. This function should go through both `input1` and `input2` and mark them as spent if they refer to UTXOs.

> For a [Transaction](?tab=details&scroll=Transaction) both inputs are not required. In the case of a [Deposit Transaction](?tab=details&scroll=Deposit%20Transaction) there are no inputs! 

3. If an input is not used in the transaction, do not mark it as spent. 

> You can tell if the input is not used if it is set to the default value for its `blockNumber`. The default value for a `blockNumber` is `0`. Since we start blocks at `1` seeing a `blockNumber` of `0` is an indication this is an undefined input.