## Apply Transaction

Amazing work so far! Now let's write a function that will take a transaction and mark it's inputs as spent. 

> Remember that Plasma Transactions use [UTXOs as inputs](?tab=details&scroll=Using%20UTXOs). It will the outputs we'll want to mark as spent, not the inputs. **Transaction inputs are used to reference an output.**

1. Define an `applyTransaction` function with a transaction as it's only argument. We will apply it by marking any outputs that it used as input.

> For a [Transaction](?tab=details&scroll=Transaction) both inputs are not required. In the case of a [Deposit Transaction](?tab=details&scroll=Deposit%20Transaction) there are no inputs! 

2. This function should go through both `input1` and `input2` and find the output they refer to. 

> To find the referenced output you can find `blockNumber`, `transactionIndex` and `outputIndex` on both `input1` and `input2`, which are both instances of `TransactionInput`. You can also use its `encode()` function to get its UTXO ID (see `plasmaObjects.js`).

3. If an input refers to an existing output, mark the output as spent. 

> You can tell if the input is not used if it is set to the default value for its `blockNumber`. The default value for a `blockNumber` is `0`. Since we start blocks at `1` seeing a `blockNumber` of `0` is an indication this is an undefined input.