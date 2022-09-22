// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9; // which compiler version you want to

contract TestEvent {

    //Declare an Event
    event Deposit(address indexed _from, bytes32 indexed _id, uint _value);

    constructor() {}

    //Emit an event
    function emitEvent(bytes32 _id) public payable {
        emit Deposit(msg.sender, _id, msg.value);
    }
}