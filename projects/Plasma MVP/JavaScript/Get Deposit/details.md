## Block Timeline

It's difficult to keep straight the different counters going on in this plasma implementation. Let's take a look at a timeline:

![Block Timeline](https://res.cloudinary.com/divzjiip8/image/upload/v1553828275/BlockNumberCounter_lpfnsm.png)

As you can see, the `depositBlock` (short for `curentDepositBlock`) is set to `1` initially and then reset every time there's a submitted plasma block. Similarly the `currentPlasmaBlock` increases by the block buffer every submission. You did this part, so this should seem pretty familiar!

The `blockNumber` is the unique number we're associating our deposits and plasma blocks to in our `plasmaChain`. We can't use the `currentDepositBlock` because it repeats over the same numbers and we can't use `plasmaBlock` because it doesn't account for deposits.

Instead, we'll need a way to combine these two counts together and get a unique count, which we'll use to store every new deposit block that comes in while we are accumulating off-chain plasma blocks.

## Block Buffer

You may be asking yourself, "what is the point of the Block Buffer?". It's a bit of an implementation detail and it's easiest to understand why it's necessary by looking from the Plasma Operator's perspective. 

As the plasma operator, you submit a block. This submission is being mined, meanwhile users are still submitted UTXOs. If the plasma block was just the last deposit block + 1, you would have to wait to hear an event before knowing what that number is. 

For example, let's say blocks are mined in this order:

1. Deposit Block - 1
2. Deposit Block - 2

If you were to submit a plasma block without the buffer you might expect the next block to be `3`. But what if a deposit was mined first? Then it would be:

1. Deposit Block - 1
2. Deposit Block - 2
3. Deposit Block - 3
4. Plasma Block - 4

By using the block buffer, the operator knows that the next Plasma Block is `1000`, regardless of whether it is mined in position `3` or `4`. This is not the only way to accomplish this implementation, although it certainly does simplify things. 