We are now going to begin building the `PlasmaChain` in JavaScript. The `PlasmaChain` relies upon the `utils.js` and `plasmaObjects.js` files to work properly. Please see the details tab for an overview of each file.

## Constructor

1. Assign the operator address to a class variable `operator` 
2. Initialize a new Plasma contract instance using `web3` and assign the contract to a class the variable `plasmaContract`

## Deposit Listener

In order for the Plasma chain to stay in sync with the deposits that are sent to the Plasma contract, an event listener will need to be implemented.

1. Write the `depositListener` code that will watch for the `DepositCreated` event to fire on the Plasma contract instance. Push the returned event into the `events` array.
2. Invoke `depositListener` within the constructor

It is important to invoke the `depositListener` during initialization of the `PlasmaChain` so the event listener continuously runs for the lifespan of the Plasma chain server.