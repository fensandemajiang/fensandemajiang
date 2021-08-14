import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Tile from '@components/GlobalComponents/Tile/Tile';
import './Matches.css';

function Matches(props: InferProps<typeof Matches.propTypes>) {
  let className = 'match-container ';
  const num_matches = 5;

  if (props.orientation == 'left') {
    className += ' match-container-reverse';
  } else if (props.orientation == 'up') {
    className = 'match-container-up';
  }


  return (
    <>
      <div className={className}>
        {/* <div className="matches"></div> */}
        <Tile></Tile>
      </div>
    </>
  );
}

Matches.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
};

export default Matches;
