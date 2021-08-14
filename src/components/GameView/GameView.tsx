import React, { useEffect, FunctionComponent } from 'react';
import './GameView.css';
import Board from './Board/Board';
import Actions from './Actions/Actions';
import Deck from './Deck/Deck';
import Sidebar from '../GlobalComponents/Sidebar/Sidebar';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import { updateGameDataStateAndLog } from './gameFsm';
import type { PlayerAction } from '../../types';

const GameView: FunctionComponent = () => {
  const connectionStore = useConnectionStore(
    (state) => state.connectionState.userConnectedCount,
  );
  const gameDataState = useGameDataStore((state) => state.gameDataState);

  function discard(tileType: number, tileIndex: number) {
    const discard = confirm('discard this tile?');
    if (discard) {
      console.log(tileType, tileIndex);
    }
    // placeholder
    const stateTransition: PlayerAction = {};
    updateGameDataStateAndLog(
      gameDataState,
      stateTransition,
      useConnectionStore.getState().connectionState.peers,
      useConnectionStore.getState().connectionState.threadId,
    );
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
