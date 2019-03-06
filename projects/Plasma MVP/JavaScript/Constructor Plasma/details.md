## Single Operator

This version of Plasma is created under the assumption of a single `operator`. This means that all transactions that occur on the Plasma chain will be sent to and stored on the operator's centralized server. These transactions can then be submitted by the `operator` to the Plasma contract.

Dealing with an operator in the early stages of Plasma development helps to keep the construction simple and easy to test. The idea is that if this can be accomplished with a single `operator` it can also be accomplished with a group of validators.

 ## Plasma Blocks and Buffer

In this Plasma implementation we have two separate block numbers that will be stored in our contract, `currentPlasmaBlock` and `currentDepositBlock`. We also have a `BLOCK_BUFFER` constant of 1000.

Deposits are first submitted to the Plasma contract and then updated on the Plasma chain. As a result, a deposit block is immediately created on the Plasma chain once it is updated. 

On the other hand, Plasma transactions occur first on the Plasma chain, then are written to the `currentBlock`, and finally, once the `currentBlock` is submitted by the `operator`, the Plasma contract is updated.

As you can see, we need a buffer between deposits and Plasma chain transaction blocks in order to keep the Plasma contract and Plasma chain in sync. If there wasn't a buffer, its quite possible that a submitted block could have the same block number as a deposit block. 

If this does not make sense now, do not worry as we will be building out this logic later in the tutorial to help solidify the concepts.