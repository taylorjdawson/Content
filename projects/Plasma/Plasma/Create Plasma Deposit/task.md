## Deposit Function

1. Define a public `payable` function named `deposit`. This function should create a new `PlasmaBlock` where the root is a `keccak256` hash of the depositor's address and the value deposited. 

The `deposit` function will allow someone to deposit funds into the Plasma chain. Depositing into the contract is the first step for a user to interact with the Plasma chain.

## Deposit Event

1. Define a `DepositCreated` event with the the `owner` address, `amount` of the deposited amount, and the `blockNumber`. 

It is important to name the variables as `owner`, `amount`, and `blockNumber` because when we build the JavaScript Plasma chain, we will refer specifically to the event arguments in order to add the deposit to the Plasma chain.

2. Invoke the `DepositCreated` event within the `deposit` function.