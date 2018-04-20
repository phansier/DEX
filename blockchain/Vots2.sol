pragma solidity ^0.4.11;

contract Vots {

        address public voterAddress;
        string public username;
        uint public totalTokens;
        bytes32[] public candidateList;

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


}
