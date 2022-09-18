pragma solidity ^0.4.17; // which compiler version you want to

contract Lottery {
    address public manager;
    address[] public players;
    bool public isOpen;

    function Lottery() public {
        // we could always know who is owner
        manager = msg.sender;
        isOpen = true;
    }

    function enter() public payable {
        require(isOpen);
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function close() public payable restricted {
        isOpen = false;
    }

    function pickWinner() public restricted {
        require(isOpen == false);
        uint index = random() % players.length;
        // send this.balance (current all money) to this address 
        players[index].transfer(this.balance);
        isOpen = true;
        // create the new array with inital size is 0 (no any initial value)
        // if create initial array new address[](2), 
        // initial array will be like with initial values [0x0000..0, 0x0000..0] 
        players = new address[](0);
    }

    // return all addresses of players
    function getPlayers() public view returns (address[]) {
        return players;
    }

    // customize own function modifier 
    // this function is like proxy
    modifier restricted() {
        require(msg.sender == manager);
        // _ stand for the rest of code in function 
        _;
    }

    function random() private view returns (uint) {
        // global function keccak256 is the same as sha3
        // cast hash to uint 
        // this is not really random number, because all attributes can be getten
        // so this is not really random number
        // manager can decide who should be winner based on this random function 
        return uint(keccak256(block.difficulty, now, players));
    }

}