## Apply Transaction

Our next function will help to mark all spent UTXO's within a transaction.

1. Define an `applyTransaction` function with a transaction as it's only argument. 
2. This function should go through both `input1` and `input2` and mark them as spent if they refer to UTXOs.

> Remember that for a [Transaction](?tab=details&scroll=Transaction) both inputs do not need to be filled out and, in the case of a [Deposit Transaction](?tab=details&scroll=Deposit%20Transaction) neither will be! The default value for a `blockNumber` is `0`. Since we start blocks at `1` seeing a `blockNumber` of `0` is an indication this is an undefined input.