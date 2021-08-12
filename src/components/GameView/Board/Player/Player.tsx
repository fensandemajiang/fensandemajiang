import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import UprightTile from './UprightTile/UprightTile';
import Discards from './Discards/Discards';
import './Player.css';

function Player(props: InferProps<typeof Player.propTypes>) {
  let className = 'player';
  const hand_size = 13;

  const deck = [];

  if (props.orientation == 'left') {
    className += ' player-reverse';
  } else if (props.orientation == 'up') {
    className = 'player-up';
  }

  for (let i = 0; i < hand_size; i++) {
    deck.push(<UprightTile></UprightTile>);
  }

  return (
    <>
      <div className={className}>
        <Discards orientation={props.orientation}></Discards>
        <div className="hand">{deck}</div>
      </div>
    </>
  );
}

Player.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
};

export default Player;
