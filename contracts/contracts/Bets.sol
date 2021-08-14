// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./FenSanDeMajiangOracle.sol";

contract Bets {
    struct Bet {
        address user;
        bytes32 tableId;
        uint amount;
    }

    address internal oracleAddress = 0xFILL_IN;
    FenSanDeMajiangOracle internal oracle = FenSanDeMajiangOracle(oracleAddress);

    uint internal minimumBet = 1000;

    mapping(address=> bytes32[]) internal userBets; 
    mapping(bytes32=> Bet[]) internal tableBets; 
    mapping(bytes32=>bool) internal isTablePaidOut;

    function _isBetValid(address _user, bytes32 _tableId) private view returns (bool) {
        bytes32[] storage bets = userBets[_user];
        if(bets.length > 0) {
            for(uint i = 0; i < bets.length; i++) {
                if(bets[i] == _tableId) {
                    return false;
                }
            }
        }
        return true;
    }

    function getBets() public view returns (bytes32[]) {
        return userBets[msg.sender];
    }

    function getUserBet(bytes32 _tableId) public view returns (uint amount) { 
        Bet[] storage bets = tableBets[_tableId]; 
        for (uint i = 0; i < bets.length; i++) {
            if (bets[i].user == msg.sender) {
                return (bets[i].amount);
            }
        }
        return 0; 
    }
    function placeBet(bytes32 _tableId) public payable notDisabled {
        require(msg.value >= minimumBet);
        require(oracle.tableExists(_tableId)); 
        require(_isValidBet(msg.sender, _tableId));

        bytes32[] storage bets = userBets[msg.sender]; 
        bets.push(_tableId); 

        Bet[] storage betsInTable = tableBets[_tableId]; 
        betsInTable.push(Bet(msg.sender, _tableId, msg.value)); 
    }
}
