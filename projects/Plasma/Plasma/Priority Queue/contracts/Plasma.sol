pragma solidity ^0.4.19;

import "./SafeMath.sol";
import "./PriorityQueue.sol";

contract Plasma {
  using SafeMath for uint256;
  address public operator;
  uint public currentPlasmaBlock;
  uint public currentDepositBlock;

  uint public BLOCK_BUFFER = 1000;

  mapping(uint => PlasmaBlock) public plasmaChain;
  mapping(uint256 => Exit) public exits;
  mapping(address => address) public exitQueues;

  event DepositCreated(
    address owner, 
    uint256 amount, 
    uint256 blockNumber
  );

  event ExitStarted(
    address exitor,
    uint256 utxoPos,
    address token,
    uint256 amount
  );

  struct PlasmaBlock {
      bytes32 root;
      uint256 timestamp;
  }

  struct Exit {
    address exitor;
    address token;
    uint256 amount;
  }
  
  function Plasma() public {
    operator = msg.sender;
    currentPlasmaBlock = BLOCK_BUFFER;
    currentDepositBlock = 1;
    exitQueues[address(0)] = new PriorityQueue();
  }

  function deposit() 
    public
    payable
  {
    bytes32 root = keccak256(msg.sender, msg.value);
    uint256 blockNum = getDepositBlock();
    plasmaChain[blockNum] = PlasmaBlock(
      root,
      block.timestamp
    );
    DepositCreated(msg.sender, msg.value, blockNum);
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

  function addExitToQueue(uint256 _utxoPos, address _token, address _exitor, uint256 _amount, uint256 _createdAt)
    public
  {
    require(_amount > 0);
    require(exitQueues[_token] != address(0));
    require(exits[_utxoPos].amount == 0);
    PriorityQueue queue = PriorityQueue(exitQueues[_token]);

    uint256 exitableAt = _createdAt + 2 weeks;
    queue.insert(exitableAt, _utxoPos);

    exits[_utxoPos] = Exit(_exitor, _token, _amount);
    ExitStarted(_exitor, _utxoPos, _token, _amount);
  }

  function getDepositBlock() 
    internal
    returns (uint256)
  {
      return currentPlasmaBlock.sub(BLOCK_BUFFER).add(currentDepositBlock);
  }
}