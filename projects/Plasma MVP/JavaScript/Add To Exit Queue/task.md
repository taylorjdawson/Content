When exiting transactions from the Plasma chain, a queue is established to allow each exit a specified challenge period. We will later define this challenge period within the `addExitToQueue` function. 

Let's begin by importing the `ExitQueue.sol` contract into our `Plasma.sol` contract. 

1. Import the `ExitQueue.sol` contract into `Plasma.sol`

## Exit Setup

1. Define an `Exit` struct with an exitor `address` and `uint256` amount as it's arguments
2. Define a public `exits` mapping where a UTXO position is mapped to an `Exit` struct
3. Define a public `exitQueue` which will be an instance of the `ExitQueue` contract. Instantiate this `exitQueue` within the constructor.
4. Define an `ExitStarted` event with an `exitor` address, utxo position named `utxoPos`, and `amount` to be exited as it's attributes.

## Add Exit to Queue

1. Define an `addExitToQueue` public function with a UTXO position, exitor address, and an exit amount as it's arguments.

This function should revert if:

a) the amount is equal to 0   
b) the exit already exits within the `exits` mapping. 

An exit can be checked for existence by determining if the amount of that exit is 0, meaning that the exit was already paid out.

Before pushing an exit onto the queue, you will need to calculate an `exitableAt` date. The `exitableAt` date should be the current block timestamp plus `2 weeks`. 

> In practice, the exitable date could be anything. However, for testing purposes we have set `exitableAt` date as stated above.

Then create the `Exit` and map it to it's UTXO position.

Finally, emit the `ExitStarted` event.