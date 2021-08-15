import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Timer from '../Timer/Timer';
import Player from './Player/Player';
import './Board.css';

function Board(props: InferProps<typeof Board.propTypes>) {
  return (
    <>
      <div className="board-container">
        <div className="board">
          <div className="board-player-container">
            <Player></Player>
            <div className="board-center-div">
              <Player orientation="up"></Player>
              <Player orientation="bottom"></Player>
            </div>
            <Player orientation="left"></Player>
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
