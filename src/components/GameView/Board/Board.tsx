import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Timer from './Timer/Timer';
import Player from './Player/Player';
import MoreTile from './MoreTile/MoreTile';
import './Board.css';

function Board(props: InferProps<typeof Board.propTypes>) {

  return (
    <>
      <div className="board-container">
        <div className="board">
          <div className="board-timer-container">
            <Timer></Timer>
          </div>
          <div className="board-player-container">
            <Player></Player>
            <Player orientation="up"></Player>
            <Player orientation="left"></Player>
          </div>
          <div className="board-middle-container">
            <MoreTile></MoreTile>
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
