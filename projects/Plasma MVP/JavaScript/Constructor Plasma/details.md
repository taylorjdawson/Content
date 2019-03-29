## Single Operator

This version of Plasma is created under the assumption of a single `operator`. This means that all transactions that occur on the Plasma chain will be sent to and stored on the operator's centralized server. These transactions can then be submitted by the `operator` to the Plasma contract.

Dealing with an operator in the early stages of Plasma development helps to keep the construction simple and easy to test. The idea is that if this can be accomplished with a single `operator` it can also be accomplished with a group of validators.

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
