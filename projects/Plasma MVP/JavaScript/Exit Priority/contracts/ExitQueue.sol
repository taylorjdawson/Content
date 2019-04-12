pragma solidity ^0.5.0;

contract ExitQueue {
    mapping(uint256 => uint256) queue;
    uint256 first = 1;
    uint256 last = 0;

    function currentSize() public view returns(uint256) {
        return last - first + 1;
    }

    function pushForward(uint256 index) public {
        for(uint i = currentSize(); i >= index; i--) {
            queue[i+1] = queue[i];
        }
    }

    function enqueue(uint256 _exitableDate, uint256 _utxoPos) public {
        uint size = currentSize();
        uint element = _exitableDate << 128 | _utxoPos;
        last += 1;
        if(size == 0) {
            queue[last] = element;
        }
        else {
            for(uint i = first; i <= last; i++) {
                if(element < queue[i]) {
                    pushForward(i);
                    queue[i] = element;
                    break;
                }
            }
        }
    }

    function peek() public view returns (uint256, uint256) {
        require(last >= first); 
        return _splitElement(queue[first]);
    }

    function dequeue() public {
        require(last >= first); 
        delete queue[first];
        first += 1;
    }

    function _splitElement(uint256 _element) private pure returns (uint256, uint256) {
        uint256 priority = _element >> 128;
        uint256 value = uint256(uint128(_element));
        return (priority, value);
    }
}