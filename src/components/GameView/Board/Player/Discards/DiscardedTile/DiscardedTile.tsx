import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Tile from '@components/GlobalComponents/Tile/Tile';
import './DiscardedTile.css';

function DiscardedTile(props: InferProps<typeof DiscardedTile.propTypes>) {
  const images: string[] = [''];

  let tileOrientation = 'tile-right';
  let rotation = "right"

  if (props.orientation == 'left') {
    tileOrientation = 'tile-left';
    rotation = "left"
  } else if (props.orientation == 'up') {
    tileOrientation = 'tile-up';
    rotation = "up"
  }

  let img;
  if (typeof props.type == 'number') {
    img = <Tile className={'small-tile-image'}></Tile>;
  } else {
    img = <div className={'no-image '}></div>;
  }

  return (
    <>
      <div className={'discarded-tile ' + tileOrientation + " " + rotation}>{img}</div>
    </>
  );
}

DiscardedTile.propTypes = {
  any: PropTypes.any,
  type: PropTypes.number,
  orientation: PropTypes.string,
};

export default DiscardedTile;
