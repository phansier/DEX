pragma solidity ^0.4.11;

contract Vots {
	
	address public voterAddress;
	string public username;
	uint public totalTokens;

	function Vots(string _username, uint tokens) {
		voterAddress = msg.sender;
		totalTokens = tokens;
		username = _username;
	}

	function holder() returns (address) { return voterAddress; }
	function holderName() returns (string) { return username; }
	function holderBalance() returns (uint) { return totalTokens; }


}
