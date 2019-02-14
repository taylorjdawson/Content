pragma solidity ^0.5.0;

contract Buidlathon {
  uint public maxParticipants;
  uint public numberOfParticipants;
  address[] public participants;
  mapping(address => bool) entered;
  
  constructor(uint _maxParticipants) public {
    maxParticipants = _maxParticipants;
  }

  function enter() public {
    require(participants.length < maxParticipants);
    require(!entered[msg.sender]);
    entered[msg.sender] = true;
    participants.push(msg.sender);
    numberOfParticipants = numberOfParticipants + 1;
  }
}
