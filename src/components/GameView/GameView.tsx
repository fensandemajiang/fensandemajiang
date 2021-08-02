import React, { useEffect, FunctionComponent } from 'react';
import PeerContextProvider from './p2p';
import { useGameDataStore } from '../../utils/store';
import { Suite, Flower, Dragon, Wind } from '../../types';
import type { Tile } from '../../types';
import './GameView.css';

const GameView: FunctionComponent = () => {
  useEffect(() => {
    // initalize game state

    // TODO: set player IDs
    // get player IDs from connection State? or from db

    // fill in Wan, Tong and Tiao
    const deck: Tile[] = [];
    for (let num = 1; num <= 9; num++) {
      // face value
      for (const suite of [Suite.Wan, Suite.Tong, Suite.Tiao]) {
        // suite
        for (let count = 0; count < 4; count++) {
          // count
          deck.push({
            suite: suite,
            value: num,
          });
        }
      }
    }

    // fill in dragons
    for (const dragon in Object.keys(Dragon)) {
      // face value
      for (let count = 0; count < 4; count++) {
        //count
        deck.push({
          suite: Suite.Dragons,
          dragon: dragon as Dragon,
        });
      }
    }

    // fill in winds
    for (const wind of Object.keys(Wind)) {
      for (let count = 0; count < 4; count++) {
        deck.push({
          suite: Suite.Winds,
          wind: wind as Wind,
        });
      }
    }

    // fill in flowers
    for (const flower of Object.keys(Flower)) {
      for (let count = 0; count < 4; count++) {
        deck.push({
          suite: Suite.Flowers,
          flower: flower as Flower,
        });
      }
    }

    // TODO: randomize deck
    // TODO: deal tiles to players

    // update deck
    useGameDataStore.setState({
      ...useGameDataStore.getState(),
      gameDataState: {
        ...useGameDataStore.getState().gameDataState,
        deck: deck,
      },
    });
  }, []);

  return (
    <div className="mainview">
      <PeerContextProvider>hello world</PeerContextProvider>
    </div>
  );
};

export default GameView;
