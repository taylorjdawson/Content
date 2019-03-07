## Deposit Listener

In order for the Plasma chain to stay in sync with the deposits that are sent to the Plasma contract, an event listener will need to be implemented.

1. Write the `depositListener` code that will watch for the `DepositCreated` event to fire on the Plasma contract instance. Push the returned event into the `events` array.
2. Invoke `depositListener` within the constructor

It is important to invoke the `depositListener` during initialization of the `PlasmaChain` so the event listener continuously runs for the lifespan of the Plasma chain server.