## Deposit Block

At this point you may be wondering why there are two separate counters for `currentPlasmaBlock` and a `currentDepositBlock`. Don't get caught up in the names, both track the creation of plasma blocks! 

There are two ways a Plasma Block can be created:

1. The centralized plasma operator creates a plasma block. This happens when the operator is ready to commit a series of transactions to the main chain. 

2. A deposit occurs. This happens when a user wants to enter the plasma chain and deposits some tokens into the root contract. 

We track the first one as the `currentPlasmaBlock` and the second as the `currentDepositBlock` so that we can limit the number of deposits between each operator's plasma block. Hopefully this limit will never be reached as long as the operator commits regularly. The limit of deposits is the `BLOCK_BUFFER`. 

## Architecture

The goal of these first three stages is to create a Plasma Contract that allows users to deposit ether into a plasma chain.

![Plasma Contract](https://res.cloudinary.com/divzjiip8/image/upload/v1553299880/ContractDeposits_flbay7.png)

For each deposit we'll create a special Plasma Block called a Deposit Block that will keep track of who deposited the block and how much they deposited.
