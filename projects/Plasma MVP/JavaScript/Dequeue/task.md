## Peeking & Dequeuing

We're going to create two functions that will allow us to see the front item on the queue and another one that will allow us to remove that item from the queue.

Create two public functions: 

1. a `dequeue` function which removes one item from the queue.
2. a `peek` function which shows the item that will be removed from the queue on the next `dequeue`. This function should return two `uint` values: exit date and UTXO position (in that order). Throw an exception if there is no item on the front of the queue.

> Remember that a Queue is a [FIFO Stucture](?tab=details).