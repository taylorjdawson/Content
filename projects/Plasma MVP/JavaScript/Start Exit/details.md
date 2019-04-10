## Plasma RLP Library

In order to send more complex data structures up to our Solidity contract, we can use [RLP Encoding/Decoding](https://github.com/ethereum/wiki/wiki/RLP#rlp-decoding). 

We can encode our exiting transaction on the client and then send that up as a single `bytes` parameter. Then, in our contract we can use `RLPDecode.sol` to decode that structure. 

The `PlasmaRLP.sol` library has already been set up for you, so you can use it's `createExitingTx` method to get a `PlasmaRLP.exitingTx`, which will contain the exiting transaction owner and amount. 

> You'll be able to access the `PlasmaRLP.exitingTx` struct as well as the `createExitingTx` method once you have imported `PlasmaRLP.sol`.

## Start Exit Visually

Let's take a look at how the `StartExit` function would look visually:

![Start Exit](https://res.cloudinary.com/divzjiip8/image/upload/v1554795497/StartExit_ksmf6c.png)

On the left we can see our arguments (including the `msg.value` which is the exit bond). 

Inside the Start Exit rectangle we have four primary concerns to accomplish in this function:

1. **Check UTXO is Within Chain** - We need to ensure that the UTXO position that is passed in does actually exist within our plasma chain. If it does not, we should revert. 

2. **Ensure UTXO belongs to exitor** - Make sure that the person calling this function does indeed own this unspent transaction output.

3. **Create an Exit & Queue Entry** - Put this Exit on our Queue to be exited after the exiting period has elapsed.

4. **Store the Exit Bond Staked** - The exitor needs to send an exit bond to ensure that they have some stake from which they will be penalized if it turns out that their exit is invalid. 

## Exit Architecture

We're going to be building two methods for handling exits: 

1. **Start Exit** - This will allow users to exit their funds from the Plasma Chain if they have ownership of an unspent transaction output.

2. **Challenge Exit** - This will allow users to challenge other exits if they have proof that the funds have been spent elsewhere. 

![Exit Architecture](https://res.cloudinary.com/divzjiip8/image/upload/v1554792644/ExitArchitecture_gr1io8.png)
