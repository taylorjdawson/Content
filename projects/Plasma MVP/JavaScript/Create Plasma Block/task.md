## Plasma Block

Awesome! Now we need to build the [Plasma Block](?tab=details). 

1. Define a `PlasmaBlock` `struct` with `bytes32` merkle root and `uint` timestamp as it's attributes.

## Plasma Chain

1. Define a public `mapping` that will take a `uint` block number and map it to a `PlasmaBlock`. This mapping should be named `plasmaChain`.

The `plasmaChain` will allow us to keep track of each block based on its block number.