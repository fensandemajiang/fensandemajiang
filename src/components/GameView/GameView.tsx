import React, { useState, useEffect, FunctionComponent } from 'react';
import PeerContextProvider, { PeerContext } from './p2p';
import { useGameDataStore } from '../../utils/store';
import { Suite } from '../../types';
import type { Tile } from '../../types';
import './GameView.css';

const GameView: FunctionComponent = () => {
  useEffect(() => {
    // initalize game state
    const gameState = useGameDataStore(state => state.gameDataState);
  
    // set player IDs
    // get player IDs from connection State? or from db

    // generate deck of tiles
    // randomize deck of tiles
    // give tiles to users
    const deck: Tile[] = []
    for (var num: number = 1; num <= 9; num++) {
      for (var suite of [Suite.Wan, Suite.Tong, Suite.Tiao]) {
        deck.push({
          suite: suite,
          value: num
        });
      }
    }

    
  }, []);

  return (
    <div className="mainview">
      <PeerContextProvider>
        hello world
      </PeerContextProvider>
    </div>
  );
};

export default GameView;
