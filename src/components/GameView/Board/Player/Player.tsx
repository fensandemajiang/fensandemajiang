import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import UprightTile from './UprightTile/UprightTile';
import Discards from './Discards/Discards';
import Matches from './Matches/Matches';
import './Player.css';

function Player(props: InferProps<typeof Player.propTypes>) {
  let className = 'player';
  const hand_size = 13;

  const deck = [];

  if (props.orientation == 'left') {
    className += ' player-reverse';
  } else if (props.orientation == 'up') {
    className = 'player-up';
  } else if (props.orientation == 'bottom') {
    className = 'player-up player-bottom';
  }

  for (let i = 0; i < hand_size; i++) {
    deck.push(<UprightTile orientation={props.orientation}></UprightTile>);
  }

  return (
    <>
      <div className={className}>
        <Discards
          orientation={props.orientation}
          discards={props.discards}
        ></Discards>
        {props.orientation != 'bottom' ? (
          <div className="hand">{deck}</div>
        ) : null}
        <Matches
          orientation={props.orientation}
          matches={props.matches}
        ></Matches>
      </div>
    </>
  );
}

Player.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
  id: PropTypes.string,
  matches: PropTypes.any,
  discards: PropTypes.any,
};

export default Player;
