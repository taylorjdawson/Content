pragma solidity ^0.5.0;

import "./ExitQueue.sol";
import "./PlasmaRLP.sol";

contract Plasma {
  using PlasmaRLP for bytes;

  address public operator;
  uint public currentPlasmaBlock;
  uint public currentDepositBlock;

  uint public BLOCK_BUFFER = 1000;
  uint256 public EXIT_BOND = 1000000000000000000;

  mapping(uint => PlasmaBlock) public plasmaChain;
  mapping(uint256 => Exit) public exits;
  ExitQueue exitQueue;

  event DepositCreated(
    address owner, 
    uint256 amount, 
    uint256 blockNumber
  );

  event ExitStarted(
    address exitor,
    uint256 utxoPos,
    uint256 amount
  );

  struct PlasmaBlock {
      bytes32 root;
      uint256 timestamp;
  }

  struct Exit {
    address exitor;
    uint256 amount;
  }
  
  constructor() public {
    operator = msg.sender;
    currentPlasmaBlock = BLOCK_BUFFER;
    currentDepositBlock = 1;
    exitQueue = new ExitQueue();
  }

  function deposit() 
    public
    payable
  {
    bytes32 root = keccak256(abi.encodePacked(msg.sender, msg.value));
    uint256 blockNum = getDepositBlock();
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

  function addExitToQueue(uint256 _utxoPos, address _exitor, uint256 _amount)
    public
  {
    require(_amount > 0);
    require(exits[_utxoPos].amount == 0);

    uint256 exitableAt = block.timestamp + 2 weeks;
    exitQueue.enqueue(exitableAt, _utxoPos);

    exits[_utxoPos] = Exit(_exitor, _amount);
    emit ExitStarted(_exitor, _utxoPos, _amount);
  }

  function decodeUTXO(uint _utxoPos) 
    public 
    view
    returns(uint, uint, uint)
  {
      uint256 blknum = _utxoPos / 1000000000;
      uint256 txindex = (_utxoPos % 1000000000) / 10000;
      uint256 oindex = _utxoPos - blknum * 1000000000 - txindex * 10000;
      return (blknum, txindex, oindex);
  }

  function startExit(
        uint256 _utxoPos,
        bytes memory _txBytes,
        bytes memory _proof,
        bytes memory _sigs
    )
        public
        payable
    {
        (uint blknum, uint txindex, uint oindex) = decodeUTXO(_utxoPos);
        
        PlasmaRLP.exitingTx memory exitingTx = _txBytes.createExitingTx(oindex);

        addExitToQueue(_utxoPos, exitingTx.exitor, exitingTx.amount);
    }


  function getDepositBlock() 
    internal
    view
    returns (uint256)
  {
      return currentPlasmaBlock - BLOCK_BUFFER + currentDepositBlock;
  }
}