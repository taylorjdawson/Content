## Import

There are a couple libraries we will rely on for this stage. Import the following into our `Plasma.sol` contract:

1. `./Validate.sol`
2. `./Merkle.sol`

## Exit Bond

1. Define an `EXIT_BOND` public constant with a value of `1 ether`.

An exit bond is attached to an exit as a retainer against the good faith of the exitor. In this way, if an exitor attempts to exit an invalid transaction and it is successfully challenged by another party, the exit would be revoked, the exitor would lose their exit bond, and the challenger would win the exit bond.

## Start Exit Validations

We need to validate that the parameters passed into `startExit` are allowed. Let's go over three scenarios where the method should revert.

1. We should revert `startExit` if the `msg.value` passed in is not equal to the `EXIT_BOND` we declared above.

2. The function should revert if the `exitor` in our exiting transaction is not equal to the sender.

3. Finally we need to [check for membership](?tab=details&scroll=Merkle%20Proof) of the merkle hash within the block's merkle tree using our `Merkle` library and revert if the hash in not included. 