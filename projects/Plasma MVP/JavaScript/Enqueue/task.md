## Let's get ready to exit!

It's time to write ourselves an exit queue! Super exciting!

This queue will allow people to exit from the plasma chain. Remember that a Queue is a [FIFO Stucture](?tab=details).

You'll need to create two `public` methods on our `ExitQueue`: 

1. `enqueue` which takes in a `uint256 _exitableDate` and a  `uint256 _utxoPos`. 

2. `currentSize` which returns the number of items in our queue. 

