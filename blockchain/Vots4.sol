pragma solidity ^0.4.11;

contract Vots {

	address public voterAddress;
	string public username;
	uint public totalTokens;
	bytes32[] public candidateList;
	bytes32[] public confirmedList;
	mapping (bytes32 => int) public votesReceived;
	mapping (bytes32 => int) public votesConfirmed;

	function Vots(string _username, uint tokens) {
		voterAddress = msg.sender;
		totalTokens = tokens;
		username = _username;
	}

	function holder() returns (address) { return voterAddress; }
	function holderName() returns (string) { return username; }
	function holderBalance() returns (uint) { return totalTokens; }

	function addCandidate(bytes32 candidate) {
		if (validCandidate(candidate) == false) {
			candidateList.push(candidate);
		}	
	}

	function allCandidates() returns (bytes32[]) {
		return candidateList;
	}

	function validCandidate(bytes32 candidate) returns (bool) {
		for(uint i = 0; i < candidateList.length; i++) {
			if (candidateList[i] == candidate) {
				return true;
			}
		}
		return false;
	}

	
	function confirmCandidate(bytes32 _candidate, int _votesInTokens) {
		if (validCandidate(_candidate) == false) throw;
		if (votesReceived[_candidate] == 0) throw;
		if (uint(votesReceived[_candidate])**uint(2) < uint(_votesInTokens)**uint(2)) throw;
//		if (votesReceived[_candidate]**int(2) < _votesInTokens**int(2)) throw;
		if ((votesReceived[_candidate] - _votesInTokens) > votesReceived[_candidate]) throw;



		uint index = indexOfCandidate(_candidate);
		if (index == uint(-1)) throw;

		votesConfirmed[_candidate] = 0;
		

		votesReceived[_candidate] = votesReceived[_candidate] - _votesInTokens;
		votesConfirmed[_candidate] = votesConfirmed[_candidate] + _votesInTokens;

	}

	function voteForCandidate(bytes32 candidate, int votesInTokens) {

		if (validCandidate(candidate) == false) {
			candidateList.push(candidate);
			votesReceived[candidate] = 0;
		}

		uint index = indexOfCandidate(candidate);
		if (index == uint(-1)) throw;

		votesReceived[candidate] = votesReceived[candidate] + votesInTokens;


	}

	function indexOfCandidate(bytes32 candidate) constant returns (uint) {
		for(uint i = 0; i < candidateList.length; i++) {
			if (candidateList[i] == candidate) {
				return i;
			}
		}
		return uint(-1);
	}

	function totalVotesFor(bytes32 candidate) constant returns (int) {
		return votesReceived[candidate];
	}
	function totalConfiramationsFor(bytes32 candidate) constant returns (int) {
		return votesConfirmed[candidate];
	}

}
