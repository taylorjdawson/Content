## New Attack 

Oh no! We found a new attack vector! 

If the operator submits an invalid double-spent transaction, they can try to exit with outputs that were created prior. Check [this out](?tab=details&scroll=Attack%20Visualization) for a full visualization of the attack.

## Priority Queue

How do we mitigate this attack? We'll need to make sure that older UTXOs can exit before newer UTXOs, even if the exit is submitted afterwards. 

To do this we'll need to turn out Exit Queue into a [Priority Queue](?tab=details&scroll=Priority%20Queue), so we can dynamically change the priority of an exit at the time it is enqueued.

We'll need to refactor our queue in two ways:

1) Change the `enqueue` function to only take in one `uint`: the priority. This will affect your peek function as well, which only needs to return one `uint`. 

2) Update the `enqueue` function to set the priority in its appropriate spot within the queue. Instead of FIFO, the first item to exit will be the highest priority. For this implementation, the lowest value will be the highest priority. 