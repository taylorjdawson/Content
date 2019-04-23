## Finalize Plasma Exits

Finalization! It's time to help our Plasma users exit the Plasma Chain for any exits greater than 2 weeks old! 

## Finalize Exits

We'll need to create a function that will loop over all exits from the top of the Exit Queue and move down until the top exit is not ready to be finalized.

1. Within `PLasma.sol`, define a public `finalizeExits` function with no arguments.

2. Within `finalizeExits` iterate over every item on the `exitQueue` and determine if it is ready to be finalized.

3. If an exit is ready to be finalized, we can transfer the amount back to the exitor (as well as the `EXIT_BOND`).

4. The last thing we'll want to do for finalized exits is ensure we `dequeue` the exit from the queue so it cannot be exited again.
