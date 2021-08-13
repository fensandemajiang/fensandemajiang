import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import './MoreTile.css';

function MoreTile(props: InferProps<typeof MoreTile.propTypes>) {
  return (
    <>
      <div className="more-tile-container">
        <div className="more-tile"></div>
      </div>
    </>
  );
}

MoreTile.propTypes = {
  any: PropTypes.any,
};

export default MoreTile;
