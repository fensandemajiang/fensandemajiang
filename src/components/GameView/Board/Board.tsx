import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Player from './Player/Player';
import { useGameDataStore } from '@utils/store';
import type { Tile } from "../../../types"
import { Suite, Dragon, Flower } from "../../../types"
import './Board.css';

function Board(props: InferProps<typeof Board.propTypes>) {

  function makeDeck(): Tile[]{
    const ret: Tile[] = []
    for( let i = 0; i < 7; i++){
      const tile: Tile = {
        suite: Suite.Tong,
        value: i+1
      }
      ret.push(tile)
    }
    return ret
  }

  let state = useGameDataStore();
  const yourIndex = state.gameDataState.currentPlayerIndex;
  const orientations = ['bottom', '', 'up', 'left'];
  const players = [];
  const deck = makeDeck()

  for (let i = 0; i < 4; i++) {
    let index = (yourIndex + i) % 4;
    const playerID = state.gameDataState.allPlayerIds[index];
    const discards = state.gameDataState.discards[playerID] ? state.gameDataState.discards[playerID].length > 0 ? state.gameDataState.discards[playerID] : deck : deck;
    const matches = state.gameDataState.shownTiles[playerID];
    const orientation = orientations[i];

    players.push(
      <Player
        id={playerID}
        orientation={orientation}
        matches={matches}
        discards={discards}
      ></Player>,
    );
  }

  return (
    <>
      <div className="board-container">
        <div className="board">
          <div className="board-player-container">
            {players[1]}
            <div className="board-center-div">
              {players[2]}
              {players[0] // this is you
              }
            </div>
            {players[3]}
          </div>
        </div>
      </div>
    </>
  );
}

Board.propTypes = {
  any: PropTypes.any,
};

export default Board;
