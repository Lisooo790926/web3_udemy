// SPDX-license-identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract MyToken is IERC20 {

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;

    // address mapping to balance 
    mapping(address => uint256) private _balances; 
    // allow others to spend the balance (A address allow -> multiple people to spend the balance)
    mapping(address => mapping (address => uint256)) _allowance;

    constructor(string memory initName, string memory initSymbol, uint8 memory initDecimal, uint256 memory initSupply) {
        _name = initName;
        _symbol = initSymbol;
        _decimals = initDecimal;
        _totalSupply = initSupply;

        // make all balance to contract owner 
        _balances[msg.sender] = _totalSupply;
    }

    function name() external override view returns (string memory) {
        return _name;
    }
    function symbol() external override view returns (string memory) {
        return _symbol;
    }
    function decimals() external override view returns (uint8) {
        return _decimals;
    }
    function totalSupply() external override view returns (uint256) {
        return _totalSupply;
    }
    function balanceOf(address _owner) external override view returns (uint256 balance) {
        return _balances[_owner];
    }
    function transfer(address _to, uint256 _value) external override returns (bool success) {
        require(_balances[msg.sender] >= _value, "Not enough amount");

        // balance exchange
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        // emit the transfer event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) external override returns (bool success) {
        // this is middle person who own the allowance to transfer from _from to _to
        uint allowBalance = _allowance[_from][msg.sender];
        uint remindAllowance = allowBalance - _value;
        // so we need to check the allowance balance is larger than _value
        require(remindAllowance >= 0, "Not enough");

        _allowance[_from][msg.sender] = remindAllowance;

        require(_balances[_from] >= _value, "Not enough in owner balance");
        _balances[_from] -= _value;
        _balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        
        // this is necessary
        return true;
    }
    function approve(address _spender, uint256 _value) external override returns (bool success) {
        // allow _spender to spend _value money
        _allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    function allowance(address _owner, address _spender) external override view returns (uint256 remaining) {
        return _allowance[_owner][_spender];
    }

}