pragma solidity ^0.4.18;

contract Voting {
    struct Vote {
        address creator;
        string question;
        uint yes;
        uint no;
        mapping (address => VoteStates) voteStates;
    }
    Vote[] public votes;

    enum VoteStates {Absent, Yes, No}
    
    function newVote(string _question) external {
        votes.push(Vote(msg.sender, _question, 0, 0));
    }
}
