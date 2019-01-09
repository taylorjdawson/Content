## Submit a Block

Since we handle deposit blocks separately from Plasma transaction blocks, we need a function to add the Plasma transaction blocks to our Plasma contract.

1. Define a `submitBlock` function with a `bytes32` merkle root as it's only argument. 

This function should create a new `PlasmaBlock`, increment the `currentPlasmaBlock` by the `BLOCK_BUFFER`, and set the `currentDepositBlock` to `1`. 

We set the `currentDepositBlock` back to `1` so we can start counting deposit blocks from the next buffer interval. This will be seen more clearly in the following stages.

Also make sure that this function can only be called by the `operator`.
