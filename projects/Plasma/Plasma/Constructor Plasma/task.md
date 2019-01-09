## Plasma Contract

The first part in building a Plasma chain is creating the smart contract which will ultimately hold the funds available on the Plasma chain, allow users to deposit into the chain, allow users to exit from the chain, and allow users to challenge any exits from the chain.

## Public variables

1. Define a public `address` named `operator`
2. Define a public `uint` named `currentPlasmaBlock`
3. Define a public `uint` named `currentDepositBlock`
4. Define a public `uint` constant named `BLOCK_BUFFER`initialized to 1000

## Constructor
1. Define a constructor function that does not take any arguments. 

The constructor function should assign the `operator` to the creator of the contract, assign the `currentPlasmaBlock` to our `BLOCK_BUFFER`, and assign the `currentDepositBlock` to 1.