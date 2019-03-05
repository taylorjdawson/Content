## Apply the Exit

In order to keep out Plasma Chain in sync with the Plasma Contract we need to update the `PlasmaChain` when an exit begins on the Plasma Contract.

1. Define an `applyExit` function with an event as it's only argument

This function should deconstruct the event arguments then mark the UTXO as spent.

## Exit Listener

1. Create an event listener for the `ExitStarted` event.

The logic for this listener will be similar to the `DepositCreated` event listener. On emit of an event, the `applyExit` function should be invoked.