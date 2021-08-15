// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "./FenSanDeMajiangOracle.sol";

contract Tables {
    
    struct Table {
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

}
