## Add to Exit Queue

When exiting transactions from the Plasma chain, a queue is established to allow each exit a specified challenge period. We will define this challenge period within the `addExitToQueue` function. 

Let's begin by importing the `ExitQueue.sol` contract you just wrote into our `Plasma.sol` contract. 

1. Import `./ExitQueue.sol` into `Plasma.sol`.

## Exit Setup

1. Define an `Exit` struct with an `address` exitor and `uint256` amount as it's arguments.
2. Define a public `exits` mapping where a UTXO position is mapped to an `Exit` struct.
3. Define a public `exitQueue` which will be an instance of the `ExitQueue` contract. Instantiate this `exitQueue` within the constructor.
4. Define an `ExitStarted` event with an `exitor` address, utxo position named `utxoPos`, and `amount` to be exited as it's attributes.

## Add Exit to Queue

1. Define an `addExitToQueue` public function with a UTXO position, exitor address, and an exit amount as it's arguments.

2. Push this exit onto our `ExitQueue`. You'll need the UTXO position and the time at which the exit can be finalized. For this exit date use the current block timestamp plus `2 weeks`.

> The exit period needs to be long enough where participants are given enough time to challenge invalid exits. This plasma construct depends heavily on clients detecting misbehavior. 

3. Then create the `Exit` and map it to it's UTXO position.

4. Finally, emit the `ExitStarted` event.