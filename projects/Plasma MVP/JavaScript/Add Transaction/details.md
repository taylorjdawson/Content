## Block Buffer

The `blockBuffer` is the same as the one defined on our Plasma contract. 

Remember, this is used to create a buffer between our deposit transaction blocks and Plasma transaction blocks.

## Next Transaction Block

The `nextTxBlock` attribute to will be used to keep track of our current block in the chain. Each time the `nextTxBlock` updates, it will be incremented by our `blockBuffer`.

## Current Block

The `currentBlock` is the object where all Plasma transactions will be stored until the `operator` submits a block. As stated before, the `currentBlock` will increment by the `blockBuffer` when a block is submitted.

## Encoded UTXO ID

The UTXO ID will encode three properties into a single integer value for convienence:

![UTXO ID](https://res.cloudinary.com/divzjiip8/image/upload/v1553559789/utxoid_nosxvu.png)

If you take a look at the `utils.js` file you'll see that the values passed in are multiplied by these factors and then added together to get the one integer value.

This value is a convienent way to refer to a spent transaction output. We'll build it into our smart contract later to expect the UTXO position in this format.