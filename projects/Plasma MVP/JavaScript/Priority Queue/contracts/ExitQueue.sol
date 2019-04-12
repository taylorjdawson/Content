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

    function enqueue(uint256 _priority) public {
        last += 1;
        if(currentSize() == 0) {
            queue[last] = _priority;
        }
        else {
            for(uint i = first; i <= last; i++) {
                if(_priority > queue[i]) {
                    pushForward(i);
                    queue[i] = _priority;
                    break;
                }
            }
        }
    }

    function peek() public view returns (uint256) {
        require(last >= first); 
        return queue[first];
    }

    function dequeue() public {
        require(last >= first); 
        delete queue[first];
        first += 1;
    }
}