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