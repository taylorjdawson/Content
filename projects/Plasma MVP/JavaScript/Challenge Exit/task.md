## A New Challenger Approaches!

Our Plasma user just started their exit from the Plasma chain, however, another user has been monitoring exited Plasma transactions and believes the exited UTXO has already been spent. 

In this case, a user can challenge an exit and be rewarded for a successfuly challenge.

## Challenge Exit

Define a public `challengeExit` function which takes in:

- challenging UTXO position
- exiting UTXO index
- exiting transaction in `bytes` 
- the proof proving the challenging transaction 
- signatures of the transaction 
- and a confirmation signature.

At this point, you should finish the function by removing the `exitor` from the specific `Exit` within `exits` and transferring the `EXIT_BOND` stored in the contract to the challenger's address.