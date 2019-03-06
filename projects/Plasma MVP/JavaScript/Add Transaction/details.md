## Block Buffer

The `blockBuffer` is the same as the one defined on our Plasma contract. 

Remember, this is used to create a buffer between our deposit transaction blocks and Plasma transaction blocks.

## Next Transaction Block

The `nextTxBlock` attribute to will be used to keep track of our current block in the chain. Each time the `nextTxBlock` updates, it will be incremented by our `blockBuffer`.

## Current Block

The `currentBlock` is the object where all Plasma transactions will be stored until the `operator` submits a block. As stated before, the `currentBlock` will increment by the `blockBuffer` when a block is submitted.
