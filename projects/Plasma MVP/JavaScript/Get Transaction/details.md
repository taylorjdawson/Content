## Encoded UTXO ID

For this plasma implementation we'll be encoding & decoding our UTXO ID. This will take our three properties `blockNumber`, `transactionIndex` and `outputIndex` and provide us with a single integer value to lookup the UTXO:

![UTXO ID](https://res.cloudinary.com/divzjiip8/image/upload/v1553559789/utxoid_nosxvu.png)

If you take a look at the `utils.js` file you'll see that  in the `encodeUtxoId` function the values passed in are multiplied by these factors and then added together to get the one integer value.

This value is a convienent way to refer to a spent transaction output. We'll build it into our smart contract later to expect the UTXO position in this format.

## Connecting UTXOs

We're trying to build a chain with a series of blocks where outputs from one transaction could be the inputs to another transaction in a different block. Here's a sketch: 

![UTXO Blocks](https://res.cloudinary.com/divzjiip8/image/upload/v1553565934/UTXOBlocks_kbzyg3.png)

Each arrow represents an output being used as an input for another transaction. Each block could batch hundreds of transactions off the blockchain which is what gives it's scalability property. 

This image is to remind you of the scale we're looking at. We can be talking potentially thousands of transactions! For a more close-up view of what's going on here. Let's take a look at two blocks where the second block uses outputs from the first:

![Block Transactions](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,h_372/v1553801107/BlockTransactions_eclwq3.png)

Here you can see the `output1` from both transactions in block #1 are mapping to the inputs of the only transaction in block #1. 