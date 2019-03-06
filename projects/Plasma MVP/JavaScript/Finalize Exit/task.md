## Finalize Plasma Exits

It is now 2 weeks since our Plasma users have exited their Plasma UTXO and the challenge period for their exit has expired. 

We can now say that those exits are finalized and transfer the appropriate funds to the exitor.

## Get Next Exit

Before writing our function to finalize exits we will need a helper function to get our next exit in the `PriorityQueue`.

1. Define a public `getNextExit` function with an `address` token as it's only argument.

This function should get the top element of within the `PriorityQueue` heaplist.

> Hint: Use the `getMin` function within the `PriorityQueue` contract.

## Finalize Exits
1. Define a public `finalizeExits` function with an `address` token as it's only argument.

The function should iterate through all the exits which are currently exitable and transfer the exit amount and `EXIT_BOND` to the `exitor`.
