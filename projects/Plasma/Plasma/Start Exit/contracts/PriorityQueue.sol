pragma solidity ^0.4.0;

import "./SafeMath.sol";

contract PriorityQueue {
    using SafeMath for uint256;

    address owner;
    uint256[] heapList;
    uint256 public currentSize;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function PriorityQueue() public {
        owner = msg.sender;
        heapList = [0];
        currentSize = 0;
    }

    function insert(uint256 _exitableDate, uint256 _utxoPos) public onlyOwner {
        uint256 element = _exitableDate << 128 | _utxoPos;
        heapList.push(element);
        currentSize = currentSize.add(1);
        _percUp(currentSize);
    }

    function getMin() public view returns (uint256, uint256) {
        return _splitElement(heapList[1]);
    }

    function delMin() public onlyOwner returns (uint256, uint256) {
        uint256 retVal = heapList[1];
        heapList[1] = heapList[currentSize];
        delete heapList[currentSize];
        currentSize = currentSize.sub(1);
        _percDown(1);
        heapList.length = heapList.length.sub(1);
        return _splitElement(retVal);
    }

    function _minChild(uint256 _index) private view returns (uint256) {
        if (_index.mul(2).add(1) > currentSize) {
            return _index.mul(2);
        } else {
            if (heapList[_index.mul(2)] < heapList[_index.mul(2).add(1)]) {
                return _index.mul(2);
            } else {
                return _index.mul(2).add(1);
            }
        }
    }

    function _percUp(uint256 _index) private {
        uint256 index = _index;
        uint256 j = index;
        uint256 newVal = heapList[index];
        while (newVal < heapList[index.div(2)]) {
            heapList[index] = heapList[index.div(2)];
            index = index.div(2);
        }
        if (index != j) heapList[index] = newVal;
    }

    function _percDown(uint256 _index) private {
        uint256 index = _index;
        uint256 j = index;
        uint256 newVal = heapList[index];
        uint256 mc = _minChild(index);
        while (mc <= currentSize && newVal > heapList[mc]) {
            heapList[index] = heapList[mc];
            index = mc;
            mc = _minChild(index);
        }
        if (index != j) heapList[index] = newVal;
    }

    function _splitElement(uint256 _element) private pure returns (uint256, uint256) {
        uint256 priority = _element >> 128;
        uint256 value = uint256(uint128(_element));
        return (priority, value);
    }
}
