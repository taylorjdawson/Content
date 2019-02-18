## Integers

In Solidity, signed integers can be defined with `int` and unsigned with `uint`. Being "signed" simply means that it can indicate positive or negative values. Unsigned values do not need to dedicate a bit to the sign so they can store just about double the values! 

A `public` integer can be defined as follows:

```
uint public myNumberVariable;
```

See more about Integers [in the Solidity Documentation](https://solidity.readthedocs.io/en/latest/types.html#integers).

## Contract Constructor

When you deploy a Smart Contract, the contract runs a special function called a "Constructor". This function is generally used to setup variables that will be used throughout the remainder of the contract's functions. 

You can declare a constructor as follows:

```
constructor(uint someVariable) public {

}
```

You can learn more about Contracts in the [Contracts](https://solidity.readthedocs.io/en/latest/contracts.html) documentation.

## Getter Functions

There are two ways to create a "getter" function in Solidity. 

First, you can simply define it. For instance,

```
uint myNumber;

function getMyNumber() public {
    return myNumber;
}
```

In the above case `getMyNumber` will return `myNumber`, so it acts as a way for us to access `myNumber`.

Similarly, we can declare `myNumber` public:

```
uint public myNumber;
```

By doing this, a getter function called `myNumber` is created automatically, which can be accessed from outside the contract.