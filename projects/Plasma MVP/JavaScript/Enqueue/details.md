## FIFO 

A Queue is a FIFO, or First-In-First-Out structure.

This means that the things we enqueue first will be the things we dequeue first. Let's take a look at an example. We'll enqueue 3 items.

1. Enqueue the letter 'a'
2. Enqueue the letter 'b'
3. Enqueue the letter 'c'

**Question**: When we dequeue, what order will the letters come out in `abc` or `cba`?

**Answer:** The answer is `abc`! The first letter to be enqueued, `a` was also the first letter to be dequeued. 