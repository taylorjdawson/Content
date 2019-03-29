## Block Counters

In our `Plasma.sol` contract to this point, we've have two counters: `currentDepositBlock` and `currentPlasmaBlock`. 

On every deposit the `currentDepositBlock` increments by one. On every submission the `currentDepositBlock` resets and the `currentPlasmaBlock` increments by the buffer. 

> The block buffer helps the JS Operator keep a deterministic value for the next plasma block. Here's a [reminder of the buffer's importance](?tab=details&scroll=Block%20Buffer).

## Get Block Number

Now we'll need a way to create a unique block number for deposits based on both counters. 

1. Within our `deposit` function update the way we calculate the determine the blockNumber for the deposit. Prior to this stage we just used `currentDepositBlock`, but now we'll also need to account for the submitted plasma blocks.
2. Ensure that the `blockNumber` submitted in the `DepositCreated` event also reflects this new calculation.

> To see how the blockNumber ought to be calculated check out the [Block Timeline](?tab=details&scroll=Block%20Timeline).