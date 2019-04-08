## A New Challenger Approaches!

Our Plasma user just started their exit from the Plasma chain! However, another user has been monitoring Plasma Exits and believes the exited UTXO has already been spent. 

In this case, a user can challenge an exit and be rewarded for a successful challenge.

## Challenge Exit

Define a public `challengeExit` function which takes in six parameters:

- `uint256` - challenging UTXO position 
- `uint256` - exiting UTXO index
- `bytes` - exiting transaction in `bytes` 
- `bytes` - the proof proving the challenging transaction 
- `bytes` - signatures of the transaction 
- `bytes` - confirmation signature.

For this stage, let's take the challenger's word for it and simply accomplish two things:

1. Remove the `exitor` from the specific `Exit` within `exits`.
2. Transfer the `EXIT_BOND` stored in the contract to the challenger's address.