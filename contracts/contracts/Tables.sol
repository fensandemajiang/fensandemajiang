//HEAVILY influenced/copied from @jrkosinski on Github
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./BetPayout.sol";

contract Tables {

    using DateLib for DateLib.DateTime;
    
    struct Table {
        string name;
        uint participantCount;
        bytes32 tableId;
        Outcome outcome;
        Bet[] users;
        mapping(address => uint) scores;
    }

    enum Outcome {
        Pending,
        Underway,
        Decided
    }

    mapping(bytes32 => Table[]) tables;

    Table[] tableList;

    mapping(bytes32 => uint) tableIndex;

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
        require(!tableExists(id));
        mapping(address => uint) initScores;
        Bet[] users = [];
        uint _participantCount = 4;
        uint newIndex = tableList.push(Table(_name, _participantCount, _tableId, Outcome.Underway, users, initScores))-1; 
        return id;
    }

    function startTable(bytes32 _tableId) {
        require(tableExists(_tableId)); 
        Table table = tables[getIndex(_tableId)];
        require(table.outcome == Outcome.Pending);
        table.outcome = Outcome.Underway;
    }

    function finishTable(bytes32 _tableId, mapping(address => uint) scores) {
        require(tableExists(_tableId)); 
        Table table = tables[getIndex(_tableId)];
        require(table.outcome == Outcome.Underway);
        table.outcome = Outcome.Decided;
        table.scores = scores;
        BetPayout.checkOutcome(_tableId);
    }

    function getTable(bytes32 _tableId) public view returns (Outcome outcome, Bet[] users, mapping(address => uint) scores) {
        Table table = tables[_tableId];
        return (table.outcome, table.users, table.scores);
    }

}
