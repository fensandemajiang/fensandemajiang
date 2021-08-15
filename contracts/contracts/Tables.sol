// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./FenSanDeMajiangOracle.sol";

contract Tables {
    
    struct Table {
        uint tableId;
        Outcome outcome;
        Bet[] users;
        mapping(address => uint) scores;
    }

    enum Outcome {
        Pending,
        Underway,
        Decided
    }

    mapping(uint => Table[]) tables;

    function getTable(uint _tableId) public view returns
        (
            Outcome outcome,
            Bet[] users,
            mapping(address => uint) scores
            );
        //Table table = tables[_tableId];
        //return (table.outcome, table.users, table.scores)

}
