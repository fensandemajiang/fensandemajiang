import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Match from './Match';
import './Matches.css';

function Matches(props: InferProps<typeof Matches.propTypes>) {
  let className = 'matches-container ';
  const num_matches = props.matches ? props.matches.length : 5;
  const matches = [];

  if (props.orientation == 'left') {
    className += ' matches-container-reverse';
  } else if (props.orientation == 'up') {
    className = 'matches-container-up';
  } else if (props.orientation == 'bottom') {
    className = 'matches-container-bottom';
  }

  for (let i = 0; i < num_matches; i++) {
    const match = props.matches ? props.matches[i] : [];
    matches.push(
      <Match key={i} orientation={props.orientation} match={match}></Match>,
    );
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
  matches: PropTypes.arrayOf(PropTypes.array),
};

export default Matches;
