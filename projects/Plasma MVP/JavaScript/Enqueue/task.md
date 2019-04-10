## Let's get ready to exit!

In a couple stages we'll write the functionality that will allow users to move their funds from the plasma chain into the main chain (we'll refer to this as an "exit"). When we write that functionality we'll need to introduce a period of time where users can **challenge** the exit if they try to move funds that have already been spent. 

More on that later. For now know that we'll need to write a Queue that will allow us to hold a series of "exits" and finalize them after a period of time in [First-In-First-Out (FIFO)](?tab=details) order.

You'll need to create two `public` methods on our `ExitQueue`: 

1. `enqueue` which takes in a `uint256 _exitableDate` and a  `uint256 _utxoPos`. 

2. `currentSize` which returns the number of items in our queue. 

