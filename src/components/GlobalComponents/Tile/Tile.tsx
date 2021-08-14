import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import './Tile.css';

function Tile(props: InferProps<typeof Tile.propTypes>) {
  return (
    <>
      <img 
        className={'tile ' + (props.className ? props.className : '')}
        onClick={props.onClick ? props.onClick : undefined}
      ></img>
    </>
  );
}

Tile.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Tile;
