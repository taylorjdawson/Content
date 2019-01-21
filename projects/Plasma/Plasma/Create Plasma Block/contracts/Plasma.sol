pragma solidity ^0.4.19;

import "./SafeMath.sol";

contract Plasma {
  using SafeMath for uint256;
  address public operator;
  uint public currentPlasmaBlock;
  uint public currentDepositBlock;

  uint public BLOCK_BUFFER = 1000;

  mapping(uint => PlasmaBlock) public plasmaChain;

  struct PlasmaBlock {
      bytes32 root;
      uint256 timestamp;
  }
  
  function Plasma() public {
    operator = msg.sender;
    currentPlasmaBlock = BLOCK_BUFFER;
    currentDepositBlock = 1;
  }
}