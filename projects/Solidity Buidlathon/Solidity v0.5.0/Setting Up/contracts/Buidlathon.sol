pragma solidity ^0.5.0;

contract Buidlathon {
  uint public maxParticipants;
  
  constructor(uint _maxParticipants) public {
    maxParticipants = _maxParticipants;
  }
}
