pragma solidity ^0.5.0;

contract Buidlathon {
  uint public maxParticipants;
  uint public numberOfParticipants;
  address[] public participants;
  
  constructor(uint _maxParticipants) public {
    maxParticipants = _maxParticipants;
  }

  function enter() public {
    require(participants.length < maxParticipants);
    participants.push(msg.sender);
    numberOfParticipants = numberOfParticipants + 1;
  }
}
