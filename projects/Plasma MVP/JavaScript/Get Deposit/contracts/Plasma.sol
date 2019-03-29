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
    uint256 blockNum = getBlockNumber();
    plasmaChain[blockNum] = PlasmaBlock(
      root,
      block.timestamp
    );
    emit DepositCreated(msg.sender, msg.value, blockNum);
    currentDepositBlock++;
  }

  function submitBlock(bytes32 _root) 
    public 
  {
    require(msg.sender == operator);
    plasmaChain[currentPlasmaBlock] = PlasmaBlock(_root, block.timestamp);
    currentPlasmaBlock += BLOCK_BUFFER;
    currentDepositBlock = 1; 
  }

  function getBlockNumber() 
    internal
    returns (uint256)
  {
      return currentPlasmaBlock - BLOCK_BUFFER + currentDepositBlock;
  }
}