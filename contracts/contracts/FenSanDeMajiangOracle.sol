// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract FenSanDeMajiangOracle {
    Request[] requests;
    uint currentId = 0;
    uint minQuorum = 1;
    uint totalOracleCount = 1;

}
struct Request {
    uint id;
    string urlToQuery
    string attributeToFetch;
    string agreedValue;
    mapping(uint => string) anwers;
    mapping(address => uint) quorum;    //oracles which will query the answer (1=oracle hasn't voted, 2=oracle has voted)
}

