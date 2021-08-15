import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Match from './Match';
import './Matches.css';
import type { Tile } from "../../../../../types"
import { Suite } from "../../../../../types"

function Matches(props: InferProps<typeof Matches.propTypes>) {
  let className = 'matches-container ';
  const num_matches = props.matches ? props.matches.length : 5;
  const matches = [];

  function makeMatches(): Tile[][]{
    const ret: Tile[][] = []
    for( let i = 0; i < 2; i++){
      const arr = []
      for( let j = 0; j < 4; j++ ){
        const tile: Tile = {
          suite: Suite.Winds,
          value: j+1
        }
        arr.push(tile)
      }
      ret.push(arr)
    }
    return ret
  }

  if (props.orientation == 'left') {
    className += ' matches-container-reverse';
  } else if (props.orientation == 'up') {
    className = 'matches-container-up';
  } else if( props.orientation == 'bottom' ){
    className = 'matches-container-bottom';
  }

  const all_matches = makeMatches()
  for (let i = 0; i < num_matches; i++) {
    const match = props.matches ? props.matches[i] : all_matches[i]
    matches.push(<Match orientation={props.orientation} match={match}></Match>);
  }

  return (
    <>
      <div className={className}>
        {/* <div className="matches"></div> */}
        {matches}
      </div>
    </>
  );
}

Matches.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.array)
};

export default Matches;
