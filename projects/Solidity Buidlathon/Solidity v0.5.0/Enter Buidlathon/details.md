## Solidity Mappings

In Solidity you can "map" a key to a value using a `mapping` type. 

If you wanted to store what ethereum addresses have used your decentralized store, you could do so with a mapping like so:

```
mapping(address => bool) customers;
```

Now you can store addresses as customers:

```
customers[msg.sender] = true;
```

And quickly look up if they've been to your store in other places:

```
if(customers[msg.sender]) {

}
```

Learn more about Mappings in the [Solidity Documentation](https://solidity.readthedocs.io/en/latest/types.html#mapping-types).


## Solidity Arrays 

In Solidity you can create an array (a list of elements) with the following syntax:

```
address[] myAddresses
```

This will create a list of `address` variables. You can push new addresses onto this array whenever you need to like so:

```
myAddresses.push(msg.sender)
```

Additionally you can determine the length of your array with `myAddresses.length`.

Learn more about arrays [here](https://solidity.readthedocs.io/en/latest/types.html#arrays).


## The Function Caller Address

In Solidity, there are a number of globally available variables. Among these is `msg.sender` which will give you the ethereum `address` calling the function. 

Here's some documentation on [Units and Globally Available Variables](https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=msg.sender)