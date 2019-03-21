pragma solidity ^0.5.0;

import "./ExitQueue.sol";
import "./PlasmaRLP.sol";
import "./Validate.sol";
import "./Merkle.sol";
import "./ByteUtils.sol";

contract Plasma {
  using PlasmaRLP for bytes;
  using Merkle for bytes32;

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

  function startExit(
        uint256 _utxoPos,
        bytes memory _txBytes,
        bytes memory _proof,
        bytes memory _sigs
    )
        public
        payable
    {
        require(msg.value == EXIT_BOND);
        uint256 blknum = _utxoPos / 1000000000;
        uint256 txindex = (_utxoPos % 1000000000) / 10000;
        uint256 oindex = _utxoPos - blknum * 1000000000 - txindex * 10000;

        // Check the sender owns this UTXO.
        PlasmaRLP.exitingTx memory exitingTx = _txBytes.createExitingTx(oindex);
        require(msg.sender == exitingTx.exitor, "Sender must be exitor.");
        // Check the transaction was included in the chain and is correctly signed.
        bytes32 root = plasmaChain[blknum].root;

        bytes32 merkleHash = keccak256(abi.encodePacked(keccak256(_txBytes), ByteUtils.slice(_sigs, 0, 130)));

        require(merkleHash.checkMembership(txindex, root, _proof), "Transaction Merkle proof is invalid.");
        // require(Validate.checkSigs(keccak256(_txBytes), root, exitingTx.inputCount, _sigs), "Signatures must match.");
        address addr = exitingTx.exitor;
        address payable exitor = address(uint160(addr));

        addExitToQueue(_utxoPos, exitor, exitingTx.amount);
    }


  function getDepositBlock() 
    internal
    view
    returns (uint256)
  {
      return currentPlasmaBlock - BLOCK_BUFFER + currentDepositBlock;
  }
}