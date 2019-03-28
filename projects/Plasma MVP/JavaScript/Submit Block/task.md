## Submit a Block

Since we handle deposit blocks separately from Plasma transaction blocks, we need a function to add the Plasma transaction blocks to our Plasma contract.

1. Define a `submitBlock` public function with a `bytes32` merkle root as it's only argument. 
2. Within this function create a new `PlasmaBlock` and add it to the Plasma chain.

> Be sure to use the `currentPlasmaBlock` as the index for this new plasma block.

3. Next we'll need increment the `currentPlasmaBlock` by the `BLOCK_BUFFER`.
4. Finally, set the `currentDepositBlock` to `1`. 

> We set the `currentDepositBlock` back to `1` so we can start counting deposit blocks from the next buffer interval. This will be seen more clearly in the following stages.

5. Also, make sure that this function can only be [called by the `operator`](?tab=details&scroll=Called%20By%20Operator).

## Block Submitted Event

We want to define an event for when block submission occurs. Not only will this be useful for logging purposes but its also very helpful with testing the contract.

1. Define a `BlockSubmitted` event with a merkle `root` and `timestamp` as attributes.

2. Invoke the event within the `submitBlock` function.