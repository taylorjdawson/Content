## The Plasma Chain

Now we begin building the `PlasmaChain` in JavaScript! Remember, in our grand architecture, this is the centralized operator component. 

You're going to build up the `plasmaChain.js` file which uses `utils.js` and `plasmaObjects.js` for support. Take a look at the [Details Tab](?tab=details) for more information on both of these files.

**Constructor**

So let's work on the **constructor** function of our PlasmaChain. We're using a [JavaScript ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) here. 

1. Assign the operator address to a class variable `operator`.
2. Initialize a new Plasma contract instance using `web3` and assign the contract to a class the variable `plasmaContract`.

> For web3, we'll be using `web3 v1.0`. Here is the [documentation](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#eth-contract) for creating a contract. 

