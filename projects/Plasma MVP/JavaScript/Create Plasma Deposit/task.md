## Deposit Block

For this task we're going to focus on the [Deposit Block](?tab=details). In the first stage you set the `currentDepositBlock` to `1`. Whenever a new deposit occurs we'll want to increment the deposit block number and create a new plasma block on our plasma chain. 

**Deposit Function**

1. Define a public `payable` function named `deposit`. This function should create a new `PlasmaBlock` where the merkle root is a hash of the depositor's address and the value deposited. 

> To create the Merkle Root hash use abi [packed encoding](https://solidity.readthedocs.io/en/v0.5.1/units-and-global-variables.html?highlight=encodepacked#abi-encoding-and-decoding-functions) within the keccak256 function. So you would pass in two arguments `a` and `b` as `keccak256(abi.encodePacked(a, b))`.

2. Add that new `PlasmaBlock` to the `plasmaChain` at the `currentDepositBlock` index.
3. Increment the `currentDepositBlock`.

The `deposit` function will allow someone to deposit funds into the Plasma chain. Depositing into the contract is the first step for a user to interact with the Plasma chain.

**Deposit Event**

1. Define a `DepositCreated` event with an `address owner`, `uint amount` for the deposited amount, and the `uint blockNumber`. 

> It is important to name the variables as `owner`, `amount`, and `blockNumber` because when we build the JavaScript Plasma chain, we will refer specifically to the event arguments in order to add the deposit to the Plasma chain.

2. Emit the `DepositCreated` event within the `deposit` function.

> The BlockNumber for this event will be the deposit block number prior to being incremented. 