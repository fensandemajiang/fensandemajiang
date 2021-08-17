import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Tile from '@components/GlobalComponents/Tile/Tile';
import './Matches.css';

function Match(props: InferProps<typeof Match.propTypes>) {
  let className = 'single-match ';
  let rotation = 'right';
  const tiles = [];

  if (props.orientation == 'left') {
    className += ' single-match-reverse';
    rotation = 'left';
  } else if (props.orientation == 'up') {
    className = 'single-match-up';
    rotation = 'up';
  } else if (props.orientation == 'bottom') {
    className = 'single-match-up';
    rotation = '';
  }

  if (props.match) {
    for (let i = 0; i < props.match.length; i++) {
      tiles.push(
        <div className={'matches-tile-container ' + rotation}>
          <Tile key={props.match[i]} tile={props.match[i]}></Tile>
        </div>,
      );
    }
  }

  return (
    <>
      <div className={className}>{tiles}</div>
    </>
  );
}

Match.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
  match: PropTypes.array,
};

export default Match;
