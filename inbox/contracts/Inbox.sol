pragma solidity ^0.4.17; // which compiler version you want to

contract Inbox {
    string public message; // anyone can access
    function Inbox(string initalMsg) public {
        message = initalMsg;
    }

    function setMessage(string newMsg) public {
        message = newMsg;
    }

}