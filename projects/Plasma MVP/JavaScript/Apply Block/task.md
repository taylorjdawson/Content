## Apply Block

Finally the function we have been building towards for the past few stages! Let's apply a Plasma block to the Plasma chain. 

The purpose of this function is to add a `Block` object to our plasma chain `blocks` while making any necessary adjustments to UTXOs being spent as inputs to this new block's set of transactions.

1. Define an `applyBlock` function with a block as it's only argument.
2. This function should iterate through the `transactionSet` of the block and invoke the `applyTransaction` function on each transaction. 
3. Once all block transactions are applied, the block should be added to `blocks` using the `blockNumber` as the object key.

> Remember that `blockNumber` will be available on the block passed in. For the definition of the `Block` class see `plasmaObjects.js`.