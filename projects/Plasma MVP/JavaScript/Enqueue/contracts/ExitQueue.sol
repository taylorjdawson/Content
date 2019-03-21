pragma solidity ^0.5.0;

contract ExitQueue {
    mapping(uint256 => uint256) queue;
    uint256 first = 1;
    uint256 last = 0;

    function currentSize() public view returns(uint256) {
        return last - first + 1;
    }

    function enqueue(uint256 _exitableDate, uint256 _utxoPos) public {
        uint256 element = _exitableDate << 128 | _utxoPos;
        last += 1;
        queue[last] = element;
    }
}