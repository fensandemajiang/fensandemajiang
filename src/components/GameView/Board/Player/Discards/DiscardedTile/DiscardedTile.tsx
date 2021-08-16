import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Tile from '@components/GlobalComponents/Tile/Tile';
import './DiscardedTile.css';

function DiscardedTile(props: InferProps<typeof DiscardedTile.propTypes>) {
  const images: string[] = [''];

  let tileOrientation = 'tile-right';
  let rotation = 'right';

  if (props.orientation == 'left') {
    tileOrientation = 'tile-left';
    rotation = 'left';
  } else if (props.orientation == 'up') {
    tileOrientation = 'tile-up';
    rotation = 'up';
  } else if (props.orientation == 'bottom') {
    tileOrientation = 'tile-up tile-bottom';
    rotation = '';
  }

  let img;
  if (props.tile) {
    img = <Tile className={'small-tile-image'} tile={props.tile}></Tile>;
  } else {
    img = <div className={'no-image '}></div>;
  }

  return (
    <>
      <div className={'discarded-tile ' + tileOrientation + ' ' + rotation}>
        {img}
      </div>
    </>
  );
}

DiscardedTile.propTypes = {
  orientation: PropTypes.string,
  tile: PropTypes.any,
};

export default DiscardedTile;
