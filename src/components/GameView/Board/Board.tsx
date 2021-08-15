import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Player from './Player/Player';
import { useGameDataStore } from '@utils/store';
import './Board.css';

function Board(props: InferProps<typeof Board.propTypes>) {

  let state = useGameDataStore();
  const yourIndex = state.gameDataState.currentPlayerIndex;
  const orientations = ['bottom', '', 'up', 'left'];
  const players = [];

  for (let i = 0; i < 4; i++) {
    let index = (yourIndex + i) % 4;
    const playerID = state.gameDataState.allPlayerIds[index];
    const discards = state.gameDataState.discards[playerID];
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
