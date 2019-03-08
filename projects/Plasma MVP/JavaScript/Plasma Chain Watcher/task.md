## Deposit Listener

In order for the Plasma chain to stay in sync with the deposits that are sent to the Plasma contract, an event listener will need to be implemented.

1. Write the `depositListener` code that will watch for the `DepositCreated` event to fire on the Plasma contract instance. 
2. In the callback, push the returned event into the `events` array.

> You can learn more about events and how to subscribe to them in web3.js [here](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#contract-events). You can assume all events will be emitted after the constructor is called, so there is no need to look for past events.

It is important to invoke the `depositListener` during initialization of the `PlasmaChain` so the event listener continuously runs for the lifespan of the Plasma chain server.