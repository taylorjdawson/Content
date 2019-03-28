## Transaction

Think of our transaction object as having four slots: two for inputs and two for outputs.

![Transaction](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,h_387/v1553712792/Transaction_wyrfqv.png)

For our `Transaction` constructor, leaving an input or output as blank will automtically set it to the `TransactionInput` and `TransactionOutput` class defaults.

In the image above `input1` refers to some other transaction output by its `blockNumber`, `transactionIndex` and `outputIndex`. For all off-chain plasma transactions, there must be an input from some other transaction output. 

## Deposit Transaction

A deposit transaction is a special type of transaction in our system that does not have inputs. This is because a deposit is essentially someone entering our Plasma implementation. There is no input to refer to, this is the first time we are tracking this new currency.

After a `DepositCreated` event has occurred on our `Plasma.sol` contract we will create a block whose only filled-in property is `output1`.

![Deposit Transaction](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,h_387/v1553713346/DepositTransaction_gbhca1.png)

All other properties should be set to their default values.

## Using UTXOs

Blocks can use UTXOs from previous blocks as input to their transactions.

![Block Transactions](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,h_372/v1553801107/BlockTransactions_eclwq3.png)

For (Block 1, Transaction 1, Output 1) and (Block 1, Transaction 2, Output 1) we have arrows drawn to the inputs of (Block 2, Transaction 2). 

When we map this outputs from the previous block they must be not `spent`. Once we use these as inputs they must become `spent`. 