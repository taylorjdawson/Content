pragma solidity ^0.4.19;

import "./SafeMath.sol";

contract Plasma {
  using SafeMath for uint256;
  address public operator;
  uint public currentPlasmaBlock;
  uint public currentDepositBlock;

  uint public BLOCK_BUFFER = 1000;

  mapping(uint => PlasmaBlock) public plasmaChain;

  event DepositCreated(
    address owner, 
    uint256 value, 
    uint256 blockNumber
  );

  struct PlasmaBlock {
      bytes32 root;
      uint256 timestamp;
  }
  
  function Plasma() public {
    operator = msg.sender;
    currentPlasmaBlock = BLOCK_BUFFER;
    currentDepositBlock = 1;
  }

  function deposit() 
    public
    payable
  {
    bytes32 root = keccak256(msg.sender, msg.value);
    plasmaChain[currentDepositBlock] = PlasmaBlock(
      root,
      block.timestamp
    );
    DepositCreated(msg.sender, msg.value, currentDepositBlock);
    currentDepositBlock++;
  }
}