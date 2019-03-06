## Single Operator

This version of Plasma is created under the assumption of a single `operator`. This means that all transactions that occur on the Plasma chain will be sent to and stored on the operator's centralized server. These transactions can then be submitted by the `operator` to the Plasma contract.

Dealing with an operator in the early stages of Plasma development helps to keep the construction simple and easy to test. The idea is that if this can be accomplished with a single `operator` it can also be accomplished with a group of validators.

## Plasma Blocks 

In this Plasma implementation we have two separate block numbers that will be stored in our contract: `currentPlasmaBlock` and `currentDepositBlock`. 

Deposits are first submitted to the Plasma contract and then updated on the Plasma chain. As a result, a deposit block is immediately created on the Plasma chain once it is updated. 

On the other hand, Plasma transactions occur first on the Plasma chain, then are written to the `currentBlock`, and finally, once the `currentBlock` is submitted by the `operator`, the Plasma contract is updated.

## Block Buffer

The `BLOCK_BUFFER` serves as a tool to keep the Plasma contract and Plasma chain in sync. As described above, we have to keep track of deposit blocks, which begin on the Plasma contract, and Plasma transaction blocks, which begin on the Plasma chain. Therefore, we start our deposit block at 1 and our Plasma transaction block at 1000 (our `BLOCK_BUFFER`) and increment by 1 and 1000 respectively. In this way, we can create up to 999 deposits before interfering with the transactions occurring on the Plasma chain. 

You will be exposed concept multiple times throughout the tutorial which should help to solidify the idea behind the framework.

If this does not make sense now, do not worry as we will be building out this logic later in the tutorial to help solidify the concepts.
