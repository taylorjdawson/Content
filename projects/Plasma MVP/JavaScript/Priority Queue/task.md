## New Attack 

Oh no! We found a new attack vector! 

If the operator submits an invalid double-spent transaction, they can try to exit with outputs that were created prior. Check [this out](?tab=details&scroll=Attack%20Visualization) for a full visualization of the attack.

## Priority Queue

How do we mitigate this attack? We'll need to make sure that older UTXOs can exit before newer UTXOs, even if the exit is submitted afterwards. 

To do this we'll need to turn out Exit Queue into a [Priority Queue](?tab=details&scroll=Priority%20Queue), so we can dynamically change the priority of an exit at the time it is enqueued.

We'll need to refactor our queue:

1) Change the `enqueue` function to create a priority based on the exit date and the UTXO position. The highest priority should be the oldest UTXO position (lowest value) and then the oldest date (lowest value).

2) Once you've calculated the priority, update the `enqueue` function to set the priority in its appropriate spot within the queue. Instead of first-in-first-out, the first item will be the highest priority. 