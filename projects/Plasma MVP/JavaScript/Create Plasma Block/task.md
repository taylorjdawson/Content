## Plasma Block

We now need to create a data structure for the Plasma block.

1. Define a `PlasmaBlock` `struct` with `bytes32` merkle root and `uint` timestamp as it's attributes.

## Plasma Chain

1. Define a public `mapping` of a `uint` mapped to a `PlasmaBlock`. This mapping should be named `plasmaChain`.

The `plasmaChain` will allow us to keep track of each block based on its block number.