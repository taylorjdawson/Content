## Block Counters

In our `Plasma.sol` contract to this point, we've have two counters: `currentDepositBlock` and `currentPlasmaBlock`. 

On every deposit the `currentDepositBlock` increments by one. On every submission the `currentDepositBlock` resets and the `currentPlasmaBlock` increments by the buffer. 

> The block buffer helps the JS Operator keep a deterministic value for the next plasma block. Here's a [reminder of the buffer's importance](?tab=details&scroll=Block%20Buffer).

## Get Block Number

Now we'll need a way to create a unique block number for deposits based on both counters. 

1. Within our `deposit` function we need to use the current block number instead of `currentDepositBlock` to store new deposits. You can calculate the block number by subtracting the `BLOCK_BUFFER` from our `plasmaBlock` and adding the deposit block.

> To understand why the block buffer is calculated in this way see the [Block Timeline](?tab=details&scroll=Block%20Timeline).

2. Ensure that the `blockNumber` submitted in the `DepositCreated` event also uses this new calculation.