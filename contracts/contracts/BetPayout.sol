// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./FenSanDeMajiangOracle.sol";
import "./Bets.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol"

contract BetPayout {
    _payOutForTable(bytes32 _tableId, Interface.Table _table) private {
            Bet[] storage bets = tableBets[_tableId];
            uint totalBets = 0;
            uint[] memory payouts = new uint[](bets.length);

            for(uint i=0; i< bets.length; i++) {
                uint amount = amount = bets[i].amount;
                totalBets = totalBets.add(amount);
            }

            for(uint i=0; i< bets.length; i++) {
                uint amount = amount = bets[i].amount;
                totalBets = totalBets.add(amount);
            }
    }
}
