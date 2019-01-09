## Exit Setup

1. Define an `Exit` struct with an exitor `address`, token `address`, and `uint256` amount as it's arguments
2. Define an `exits` mapping where a UTXO position is mapped to an `Exit` struct
3. Define an `exitQueues` mapping where an exit queue token `address` maps to the `address` of it's `PriorityQueue` contract.
4. Instantiate a `exitQueues[address(0)]` to the `address` of a new `PriorityQueue`
5. Define an `ExitStarted` event with an `exitor` address, utxo position named `utxoPos`, `token` address, and `amount` to be exited as it's attributes.

## Add Exit to Queue
6. Define an `addExitToQueue` public function with a UTXO position, token address, exitor address, exit amount, and created at date as it's arguments.

This function should revert if the amount is equal to 0, the `ProirityQueue` contract address stored in `exitQueues` is equal to `address(0)`, or the exit already exits within the `exits` mapping. An exit can be checked if it already exits by determining if the amount of that exit is 0 meaning that the exit was already paid out.

Before adding the exit into the queue, you will need to calculate an exitable date. This could be any value you want to wait for exits to be challenges.  

Next, insert the exit into the queue. 

Then create the `Exit` and map it to it's UTXO position.

Finally, emit the `ExitStarted` event.