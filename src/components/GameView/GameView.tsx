import React, { FunctionComponent } from 'react';
import './GameView.css';
import Board from './Board/Board';
import Actions from './Actions/Actions';
import Deck from './Deck/Deck';
import Sidebar from '../GlobalComponents/Sidebar/Sidebar';

const GameView: FunctionComponent = () => {
  function discard(tileType: number, tileIndex: number) {
    const discard = confirm('discard this tile?');
    if (discard) {
      console.log(tileType, tileIndex);
    }
    // placeholder
  }

  function chow(playerID: string) {
    alert(playerID);
  }

  function pung(playerID: string) {
    alert(playerID);
  }

  function kong(playerID: string) {
    alert(playerID);
  }

  return (
    <>
      <div className="game-view-container">
        <Sidebar></Sidebar>
        <div className="game-view-right">
          <div className="game-view-top">
            <Board></Board>
          </div>
          <div className="game-view-bot">
            <Deck discard={discard}></Deck>
            <Actions
              playerActions={{
                chow: chow,
                pung: pung,
                kong: kong,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameView;
