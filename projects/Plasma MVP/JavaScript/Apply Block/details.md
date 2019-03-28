## Using UTXOs

Blocks can use UTXOs from previous blocks as input to their transactions.

![Block Transactions](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,h_372/v1553801107/BlockTransactions_eclwq3.png)

For (Block 1, Transaction 1, Output 1) and (Block 1, Transaction 2, Output 1) we have arrows drawn to the inputs of (Block 2, Transaction 2). 

When we map this outputs from the previous block they must be not `spent`. Once we use these as inputs they must become `spent`. 