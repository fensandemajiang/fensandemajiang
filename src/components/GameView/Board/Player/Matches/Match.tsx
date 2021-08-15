import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Tile from '@components/GlobalComponents/Tile/Tile';
import './Matches.css';

function Match(props: InferProps<typeof Match.propTypes>) {
  let className = 'single-match ';
  let rotation = 'right';

  if (props.orientation == 'left') {
    className += ' single-match-reverse';
    rotation = 'left';
  } else if (props.orientation == 'up') {
    className = 'single-match-up';
    rotation = 'up';
  } else if(props.orientation == 'bottom'){
    className = 'single-match-up';
    rotation = "";
  }

  return (
    <>
      <div className={className}>
        <div className={'matches-tile-container ' + rotation}>
          <Tile></Tile>
        </div>
        <div className={'matches-tile-container ' + rotation}>
          <Tile></Tile>
        </div>
        <div className={'matches-tile-container ' + rotation}>
          <Tile></Tile>
        </div>
        <div className={'matches-tile-container ' + rotation}>
          <Tile></Tile>
        </div>
      </div>
    </>
  );
}

Match.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
};

export default Match;
