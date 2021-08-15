// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./FenSanDeMajiangOracle.sol";
import "./Bets.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BetPayout {
    function _payOutForTable(bytes32 _tableId, Table _table) private {
            
            Bet[] storage bets = tableBets[_tableId].users;
            uint totalBets = 0;
            uint totalScore = 0;
            uint[] memory payouts = new uint[](bets.length);

            for(uint i=0; i< bets.length; i++) {
                uint amount = bets[i].amount;
                totalBets = totalBets.add(amount);
            }

            for(uint i=0; i< bets.length; i++) {
                uint amount = bets[i].amount;
                totalBets = totalBets.add(amount);
            }

            for(uint i=0; i< bets.length; i++) {
                address userAddr = bets[i].user;
                payouts[i] = _calculatePayout(totalBets, totalScore, tableBets[_tableId].scores[userAddr]);
            }

            for(uint i=0; i< bets.length; i++) {
                _payOutWinnings(bets[i].user, payouts[i]);
            }

    }



    function _calculatePayout(uint _totalBets, uint _totalScore, uint _userScore) {
        uint payout = (_userScore.mul(_totalBets)).div(_totalScore);
        return payout;
    }


    function _payOutWinnings(address _user, uint _amount) {
        _user.transfer(_amount);
    }


    function checkOutcome(bytes32 _tableId) public returns (Tables.Outcome) {
        Tables.Outcome outcome;
        
    }


}
