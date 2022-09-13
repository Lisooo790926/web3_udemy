// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9; // which compiler version you want to

contract Inbox {
    string public message; // anyone can access
    
    constructor(string memory initalMsg) {
        message = initalMsg;
    }

    function setMessage(string memory newMsg) public {
        message = newMsg;
    }

}