## Deposit Transaction

OK, so we're listening for `DepositCreated` and we're using it create a block on our operator. 

All that's left to finish this functionality is to add a [Transaction](?tab=details&scroll=Transaction) to our block's `transactionSet`! 

1. To create a [deposit transaction](?tab=details&scroll=Deposit%20Transaction) you'll need to create a new instance of the `Transaction` class provided by `plasmaObjects.js`. Use the `owner` and `amount` variables from `returnValues` and use these to create a `TransactionOutput` for `output1`.

> The `Transaction` constructor takes four values: `input1`, `input2`, `output1`, and `output2`. For a deposit transaction you will only need to fill in `output1`, everything else leave `undefined` and they will be filled in with default values. 

2. Once you have created this transaction, add it to the block's `transactionSet`.