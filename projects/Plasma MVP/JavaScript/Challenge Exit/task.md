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

For this stage, let's assume this challenge is valid. Upon a successful challenge we'll want to do two things:

1. Remove the `exitor` from the specific `Exit` within `exits`.

> To find the exit from `exits` we can use the `PlasmaRLP` `getUtxoPos` to get the exiting UTXO position. This function requires we send over the exiting transaction and the ouput index we are targetting.

2. Transfer the `EXIT_BOND` stored in the contract to the challenger's address.

> The _challenger_ is the address calling `challengeExit` function! 