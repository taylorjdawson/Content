pragma solidity ^0.5.0;

contract Plasma {
  address public operator;
  uint public currentPlasmaBlock;
  uint public currentDepositBlock;

  uint public BLOCK_BUFFER = 1000;

  mapping(uint => PlasmaBlock) public plasmaChain;

  event DepositCreated(
    address owner, 
    uint256 amount, 
    uint256 blockNumber
  );

  struct PlasmaBlock {
      bytes32 root;
      uint256 timestamp;
  }
  
  constructor() public {
    operator = msg.sender;
    currentPlasmaBlock = BLOCK_BUFFER;
    currentDepositBlock = 1;
  }

  function deposit() 
    public
    payable
  {
    bytes32 root = keccak256(abi.encodePacked(msg.sender, msg.value));
    plasmaChain[currentDepositBlock] = PlasmaBlock(
      root,
      block.timestamp
    );
    emit DepositCreated(msg.sender, msg.value, currentDepositBlock);
    currentDepositBlock++;
  }
}