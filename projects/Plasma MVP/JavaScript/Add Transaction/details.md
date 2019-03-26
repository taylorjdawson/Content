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

We're trying to build a chain with a series of blocks where outputs from one transaction could be the inputs to another transaction in a different block. Here's a sketch: 

![UTXO Blocks](https://res.cloudinary.com/divzjiip8/image/upload/v1553565934/UTXOBlocks_kbzyg3.png)

Each arrow represents an output being used as an input for another transaction. Each block could batch hundreds of transactions off the blockchain which is what gives it's scalability property. 