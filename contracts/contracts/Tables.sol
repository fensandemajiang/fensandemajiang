//HEAVILY influenced/copied from @jrkosinski on Github
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./FenSanDeMajiangOracle.sol";

//TODO: DATELIB
//import "./DateLib.sol";

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

    function addTable(string _name, Bet[] users, uint _participantCount, uint _date) public returns (bytes32) {

        bytes32 id = keccak256(abi.encodePacked(_name, _participantCount, _date)); 
        require(!tableExists(id));
        mapping(address => uint) initScores;
        uint newIndex = tableList.push(Table(_name, _participantCount, id, MatchOutcome.Pending, users, initScores))-1; 
    }

    function startTable(bytes32 _tableId, mapping(address => uint) scores) {
        require(tableExists(_tableId)); 
        Table table = tables[getIndex(_tableId)];
        require(table.outcome == Outcome.Pending);
        table.outcome = Outcome.Underway;
        table.scores = scores;
    }

    function finishTable(bytes32 _tableId) {
        require(tableExists(_tableId)); 
        Table table = tables[getIndex(_tableId)];
        require(table.outcome == Outcome.Underway);
        table.outcome = Outcome.Decided;
    }

    function getTable(bytes32 _tableId) public view returns (Outcome outcome, Bet[] users, mapping(address => uint) scores) {
        Table table = tables[_tableId];
        return (table.outcome, table.users, table.scores);
    }

}
