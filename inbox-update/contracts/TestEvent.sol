// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9; // which compiler version you want to

contract TestEvent {

    // Declare an Event
    event Deposit(address indexed _from, bytes32 indexed _id, uint _value);

    // Other event with string
    event Deposit2(address indexed _from, string _id, uint _value);

    constructor() {}

    //Emit an event
    function emitEvent(bytes32 _id) public payable {
        emit Deposit(msg.sender, _id, msg.value);
    }

    function emitEvent2(string memory _id) public payable {
        emit Deposit2(msg.sender, _id, msg.value);
    }

    function emitEvent3(string memory _id) public payable {
        emit Deposit(msg.sender, keccak256(abi.encodePacked(_id)), msg.value);
    }
}