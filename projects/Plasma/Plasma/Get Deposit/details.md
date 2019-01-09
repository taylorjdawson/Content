## SafeMath Library

This library is useful when performing math operations within a Solidity function. 

One important thing to know about Solidity is that it does not handle integer overflow/underflow. Therefore you could wind up receiving unintended values when performing math operations.

The SafeMath library helps to revert functions that overflow/underflow their operations.

In addition, when dealing with dealing with division or modulus, the function will revert if a number is divided by zero.