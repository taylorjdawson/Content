## The Plasma Chain

Now we begin building the `PlasmaChain` in JavaScript! Remember, in our grand architecture, this is the centralized operator component. Check out the [Architecture section](?tab=details&scroll=Architecture) to see our updated schematic.

You're going to build up the `plasmaChain.js` file which uses `utils.js` and `plasmaObjects.js` for support. Take a look at the [Helper Files section](?tab=details&scroll=Helper%20Files) for more information on both of these files.

**Constructor**

So let's work on the **constructor** function of our PlasmaChain. We're using a [JavaScript ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) here. 

1. Assign the operator address to a class variable `operator`.
2. Initialize a new Plasma contract instance using the `web3` library passed into the constructor. Assign that contract instance to a class variable named `plasmaContract`.

> For web3, we'll be using `web3 v1.0`. Here is the [documentation](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#eth-contract) for creating a contract. All variables you'll need to initialize the web3 contract are passed to you in the constructor.

