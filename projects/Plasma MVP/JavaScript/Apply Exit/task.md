## Apply the Exit

In order to keep out Plasma Chain in sync with the Plasma Contract we need to update the `PlasmaChain` when an exit begins on the Plasma Contract.

1. Create an event listener for the `ExitStarted` event.

> The logic for this listener will be similar to the `DepositCreated` event listener. 

2. Deconstruct the event `returnValues` to find the UTXO position (`utxoPos`) use it to mark the UTXO as spent.

> Remember this logic is already done within the `markUtxoSpent` function.