## Next Deposit Block

Similar to our Plasma contract we need to keep track of the transaction block number as well as the deposit block number as more blocks are added to the Plasma chain.

1. Define a `nextDepositBlock` and assign it to 1.

## Add Block

1. Define an `addBlock` function with a block as it's only argument. 

This function should first check if the block is the next deposit block or the next transaction block. The block should then be applied. 

Next, we need to update the respective block numbers correctly depending on if the block was a deposit or a Plasma transaction.

If the block is the `currentBlock` the `nextCurrentBlock` should be incremented by the `blockBuffer` and the `nextDepositBlock` should reflect the submitted block number plus 1. This will allow us to maintain the 1000 block interval buffer upon each submitted current block.

If the block is a deposit block, the `nextDepositBlock` should increment by 1.

## Clean Up

1. Re-factor the `addDeposit` function to invoke `addBlock` instead of immediately storing the block inside of the `blocks` object.

> Note: Depending on how you handled the `blockNumber` argument within the `DepositCreated` event, it might be stored as a `string` or an `integer` on the `block` object. When evaluating for equality in JavaScript, we can either use a strict equality `===` that checks for equality of value and type or we can use `==` which only checks for equality of value. 