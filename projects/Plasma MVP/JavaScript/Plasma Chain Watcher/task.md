## Deposit Listener

In order for the Plasma chain to stay in sync with the deposits that are sent to the Plasma contract, an event listener will need to be implemented.

1. Write the `depositListener` code that will watch for the `DepositCreated` event to fire on the Plasma contract instance. 
2. In the event callback, take the `blockNumber` from the `returnValues` and use it to create a new `Block` with an empty transaction set.

You can learn more about events and how to subscribe to them in web3.js [here](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#contract-events). You can assume all events will be emitted after the constructor is called, so there is no need to look for past events. 

> If you're having trouble finding the `returnValues` in the event callback, use `console.log` to log the event to the test output! 