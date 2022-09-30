// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    
    uint256 private value;
    //emited when value is stored
    event ValueChanged(uint256 newValue);

    //stores value in the contract
    function store(uint256 newvalue) public {
        value = newvalue;
        emit ValueChanged(newvalue);
    }

    //retrieves values
    function retrieve() public view returns (uint) {
        return value;
    }
}
