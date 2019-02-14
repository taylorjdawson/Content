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

## The Function Caller Address

In Solidity, there are a number of globally available variables. Among these is `msg.sender` which will give you the ethereum `address` calling the function. 

Here's some documentation on [Units and Globally Available Variables](https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=msg.sender)