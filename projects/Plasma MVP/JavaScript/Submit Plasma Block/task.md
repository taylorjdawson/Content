## Submit a Block

1. Define a `submitBlock` function with a block as it's only argument. 

This function should add the block to the Plasma chain then submit that block to the Plasma contract.

In order to add the block to the Plasma contract, first calculate the merkle root of the block.

Using the calculated merkle root as an argument, return a promise which submits the block to the Plasma contract then on return of that promise creates a new `currentBlock`.

> Note: The merkle root argument can be calculated using the `merkle` function within the block class then calling the `getRoot` function on that merkle instance. The `getRoot` function does not take any arguments.