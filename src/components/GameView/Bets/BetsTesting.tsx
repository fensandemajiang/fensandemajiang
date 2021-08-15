import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { placeBet, getTable, addTable, finishTable } from './betsUtils';
import '../../LobbyView/LobbyView.css';

const Bets: FunctionComponent = () => {
  const tableId = 'abcdefghijklmnopqrstuvwxyz';
  const bet = 100000000;
  const scores = {};

  const addTableOnClick = () => {
    addTable(tableId);
  };
  const getTableOnClick = () => {
    getTable(tableId);
  };
  const placeBetOnClick = () => {
    placeBet(tableId, bet);
  };
  const finishTableOnClick = () => {
    finishTable(tableId, scores);
  };
  return (
    <>
      <button className="btn" onClick={addTableOnClick}>
        Add table
      </button>
      <button className="btn" onClick={getTableOnClick}>
        Get table
      </button>
      <button className="btn" onClick={placeBetOnClick}>
        Place bet
      </button>
      <button className="btn" onClick={finishTableOnClick}>
        Finishtable
      </button>
    </>
  );
};

export default Bets;
