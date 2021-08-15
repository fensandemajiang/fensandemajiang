import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import './UprightTile.css';

function UprightTile(props: InferProps<typeof UprightTile.propTypes>) {
  let className = 'upright-tile';
  if (props.orientation == 'left' ) {
    className += ' upright-tile-left';
  } else if (props.orientation == 'up'){
    className += ' upright-tile-up';
  }

  return (
    <>
      <div className={className}></div>
    </>
  );
}

UprightTile.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
};

export default UprightTile;
