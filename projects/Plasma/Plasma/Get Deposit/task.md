## Get Deposit Block

Hopefully by now you have an understanding of why a buffer is necessary between our Plasma transaction blocks and deposit blocks. 

As such, we need to create a function to be able to provide the correct deposit block each time a deposit is entered into the Plasma contract. In this way we can keep the Plasma contract and Plasma chain in sync.

1. Define an internal `getDepositBlock` function. 

This function should use the `SafeMath` library to calculate the deposit block number then return that value. 

Remember that there is a buffer between submitted blocks and deposit blocks. The returned value should be a deposit block number which starts at the last submitted block plus 1.

## Clean up

1. Re-factor the `deposit` function to use the `getDepositBlock` function when adding a deposit block to the `plasmaChain`.