## Plasma Contract

Let's create our Plasma Contract! 

First we'll create the smart contract which will ultimately hold the funds available on the Plasma chain. It will allow users to deposit into the chain, allow users to exit from the chain, and allow users to challenge any exits from the chain.

You'll need to define four variables. One for this `address` of the [operator](?tab=details&scroll=Single%20Operator), a `uint` for both of the [Plasma Blocks](?tab=details&scroll=Plasma%20Blocks), and a `uint` for [Block Buffer](?tab=details&scroll=Block%20Buffer).

## Public variables

1. Define a public `address` named `operator`
2. Define a public `uint` named `currentPlasmaBlock`
3. Define a public `uint` named `currentDepositBlock`
4. Define a public `uint` constant named `BLOCK_BUFFER` initialized to 1000

## Constructor

1. Define a public constructor function

The constructor function should assign the `operator` to the creator of the contract, assign the `currentPlasmaBlock` to our `BLOCK_BUFFER`, and assign the `currentDepositBlock` to 1.

