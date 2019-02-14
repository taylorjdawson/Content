## Throwing Exceptions 

You can throw state-reverting exceptions in Solidity using a few different built-in functions. Let's take a look at `require`.

The following will throw an exception:

```
function myBadFunction() public {
    myNumber = 5;
    require(myNumber > 6);
}
```

Not only will this throw an error, but `myNumber` will be reverted to the value it previously held before the execution of this function.

Require will do nothing in the case where we have a truthful condition:

```
function myBadFunction() public {
    myNumber = 5;
    require(myNumber > 4);
}
```

You can learn more about Solidity Error Handling in the [Solidity Documentation](https://solidity.readthedocs.io/en/latest/control-structures.html?highlight=require#error-handling-assert-require-revert-and-exceptions).