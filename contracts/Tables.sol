//HEAVILY influenced/copied from @jrkosinski on Github
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Tables {
    struct Bet {
        address user;
        bytes32 tableId;
        uint amount;
    }

    struct Table {
        uint participantCount;
        bytes32 tableId;
        Outcome outcome;
        Bet[] users;
        address[] addresses;
        uint[] score;
    }

    enum Outcome {
        Pending,
        Underway,
        Decided
    }

    uint internal minimumBet = 1000;

    mapping(address=> bytes32[]) internal userBets;
    mapping(bytes32=>bool) internal isTablePaidOut;

    mapping(bytes32 => Table) tables;

    Table[] tableList;

    mapping(bytes32 => uint) tableIndex;


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

    /*
    function getBets() public view returns (bytes32[]) {
        return userBets[msg.sender];
    }
    */

    function getUserBet(bytes32 _tableId) public view returns (uint amount) {
        Bet[] storage bets = tables[_tableId].users; 
        for (uint i = 0; i < bets.length; i++) {
            if (bets[i].user == msg.sender) {
                return (bets[i].amount);
            }
        }
        return 0; 
    }

    function placeBet(bytes32 _tableId) public payable {
        require(msg.value >= minimumBet);
        require(tableExists(_tableId)); 
        require(_isBetValid(msg.sender, _tableId));

        bytes32[] storage bets = userBets[msg.sender]; 
        bets.push(_tableId); 

        Bet[] storage betsInTable = tables[_tableId].users; 
        betsInTable.push(Bet(msg.sender, _tableId, msg.value)); 
    }
    function _calculatePayout(uint _totalBets, uint _totalScore, uint _userScore)  public returns (uint){
        uint payout = SafeMath.div(SafeMath.mul(_userScore, _totalBets),_totalScore);
        return payout;
    }


    function _payOutWinnings(address payable _user, uint _amount)  public {
        _user.transfer(_amount);
    }

    function _payOutForTable(bytes32 _tableId) private {
        Bet[] storage bets = tables[_tableId].users;
        uint totalBets = 0;
        uint totalScore = 0;
        uint[] memory payouts = new uint[](bets.length);

        for(uint i = 0; i < bets.length; i++) {
            uint amount = bets[i].amount;
            totalBets = SafeMath.add(totalBets,amount);
        }

        for(uint i = 0; i < bets.length; i++) {
            uint amount = bets[i].amount;
            totalBets = SafeMath.add(totalBets,amount);
        }

        for(uint i = 0; i < bets.length; i++) {
            address userAddr = bets[i].user;
            uint idx;
            for(uint j = 0; j < tables[_tableId].addresses.length; j++) {
               address addr =  tables[_tableId].addresses[j];
               if(addr == userAddr){
                       idx = j;
               }

            }
            payouts[i] = _calculatePayout(totalBets, totalScore, tables[_tableId].score[idx]);
        }

        for(uint i = 0; i < bets.length; i++) {
            _payOutWinnings(payable(bets[i].user), payouts[i]);
        }

        isTablePaidOut[_tableId] = true;
    }


    function checkOutcome(bytes32 _tableId) public returns (Tables.Outcome) {
        Tables.Outcome outcome;

        (outcome,,,) = getTable(_tableId);
        if (outcome == Outcome.Decided) {
            if (!isTablePaidOut[_tableId]) {
                _payOutForTable(_tableId);
            }
        }
        return outcome;
    }

    function getIndex(bytes32 _tableId) private view returns (uint) {
        return tableIndex[_tableId] - 1;
    }

    function tableExists(bytes32 _tableId) private view returns (bool) {
        if (tableList.length == 0) {
            return false;
        }
        return (tableIndex[_tableId] > 0);
    }

    function addTable(bytes32 _tableId) public returns (bytes32) {
        require(!tableExists(_tableId));
        uint[] memory score = new uint[](0);
        address[] memory addresses  = new address[](0);
        Bet[] memory users = new Bet[](0);
        uint _participantCount = 4;
        Table memory table = Table(_participantCount, _tableId, Outcome.Underway, users, addresses, score);
        tableList.push(table); 
        return _tableId;
    }

    function startTable(bytes32 _tableId)  public {
        require(tableExists(_tableId)); 
        Table storage table = tables[_tableId];
        require(table.outcome == Outcome.Pending);
        table.outcome = Outcome.Underway;
    }

    function finishTable(bytes32 _tableId, address[] memory addresses, uint[] memory score)   public {
        require(tableExists(_tableId)); 
        Table memory table = tables[_tableId];
        require(table.outcome == Outcome.Underway);
        table.outcome = Outcome.Decided;
        table.addresses = addresses;
        table.score = score;
        checkOutcome(_tableId);
    }

    function getTable(bytes32 _tableId) public view returns (Outcome , Bet[] memory, address[] memory, uint[] memory) {
        Table memory table = tables[_tableId];
        return (table.outcome, table.users, table.addresses, table.score);
    }

}
