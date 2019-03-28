## Next Deposit Block

Similar to our `Plasma.sol` contract we need to differentiate between our deposit and transaction blocks. Let's keep a counter for both.

1. In the constructor define a `nextDepositBlock` and assign it the value `1`.

## Add Block Function

Next let's create a generic `addBlock` function that will take either a deposit block or a plasma block and apply it to our plasma blocks.

2. Define an `addBlock` function with a block as it's only argument. 
3. Use the `applyBlock` function to apply this block to our plasma blocks.

Next, we need to update the respective block numbers depending on if the block was a deposit or a Plasma transaction.

**If this is the next deposit**:

4. Increment the `nextDepositBlock` by 1.

**If this is the next plasma block**:

5. First, increment the `nextDepositBlock` to be the current `nextTxBlock` + 1. 
6. Then, increment the `nextTxBlock` by our `blockBuffer` set in the constructor.

> This logic might be tough to wrap your brain around. If you're wondering why the counters are incremented in this way, check out this [counter timeline](?tab=details&scroll=Counter%20Timeline).

## DepositCreated Listener

7. Finally, we'll need to update our `DepositCreated` listener function to invoke `addBlock` instead of immediately storing the block inside of the `blocks` object. 
