## Centralized Operator

The idea of a single, centralized operator may seem strange to those familiar with blockchain. Typically we don't rely on a single operator with our transactions because it requires an element of **trust**. Instead, blockchains provide decentralization by being a permissionless network of many computers that are financially incentivized to come to a consensus. 

Why do we use a single operator in Plasma, then? The reason is because Plasma is a special type of sidechain that works even if the consensus layer fails. As long as the base chain that plasma works on top is secure. Users can always exit their funds to the root chain provided they can offer valid proof they own the funds and they have not been spent.

## Plasma Blocks 

In this Plasma implementation we have two separate block numbers that will be stored in our contract: `currentPlasmaBlock` and `currentDepositBlock`. 

Deposits are first submitted to the Plasma contract and then updated on the Plasma chain. As a result, a deposit block is immediately created on the Plasma chain once it is updated. 

On the other hand, Plasma transactions first occur on the Plasma chain. These transactions are immediately written to the `currentBlock` on the Plasma chain. Once the `operator` submits the `currentBlock` from the Plasma chain to the Plasma contract, both are in sync with one another. 

## Block Buffer

You may be asking yourself, "what is the point of the `BLOCK_BUFFER`?". It's a bit of an implementation detail and it's easiest to understand why it's necessary by looking from the Plasma Operator's perspective. 

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

## Architecture

The goal of these first three stages is to create a Plasma Contract that allows users to deposit ether into a plasma chain.

![Plasma Contract](https://res.cloudinary.com/divzjiip8/image/upload/v1553299880/ContractDeposits_flbay7.png)

For each deposit we'll create a special Plasma Block called a Deposit Block that will keep track of who deposited the block and how much they deposited.
