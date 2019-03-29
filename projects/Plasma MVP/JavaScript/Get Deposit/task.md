## Get Block Number

In our `Plasma.sol` contract to this point, we've have two counters: `currentDepositBlock` and `currentPlasmaBlock`. 

On every deposit the `currentDepositBlock` increments by one. On every submission the `currentDepositBlock` resets and the `currentPlasmaBlock` increments by the buffer. 

> The block buffer helps the JS Operator keep a deterministic value for the next plasma block. Here's a [reminder of the buffer's importance](?tab=details&scroll=Block%20Buffer).

We have a running count for both the plasma and deposit blocks. Now we'll need a way to create a unique block number for deposits based on both counters. 

1. Define a `getBlockNumber` function. Calculate the next  then return the value. 

2. Re-factor the `deposit` function to use the `getBlockNumber` function when adding a deposit block to the `plasmaChain`.