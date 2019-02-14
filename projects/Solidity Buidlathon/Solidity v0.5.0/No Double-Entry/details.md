## Solidity Loops 

In Solidity you can use loops to quickly iterate over an array.

Something like:

```
for(uint i = 0; i < myNumbers.length; i++) {
    // do something for each iteration
}
```


You can also use the keywords `do` and `while` which work similar to most C-like languages. 

Learn more about Control Structures in the [Solidity Documentation](https://solidity.readthedocs.io/en/latest/control-structures.html#expressions-and-control-structures).

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