## Apply the Exit

1. Define an `applyExit` function with an event as it's only argument

This function should deconstruct the event arguments then invoke `markUtxoSpent` with the `utxoPos` argument.

## Exit Listener

1. Create an event listener for the `ExitStarted` event.

The logic for this listener will be similar to the `DepositCreated` event listener. On emit of an event, the `applyExit` function should be invoked.