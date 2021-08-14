import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Button } from '@components/GlobalComponents/Button/Button';
import './Overlay.css';

function Overlay(props: InferProps<typeof Overlay.propTypes>) {
  return (
    <>
      <div
        className={'overlay ' + (props.active ? 'overlay-active' : '')}
        onClick={props.onClick ? props.onClick : undefined}
      >
        <Button
          text="Discard"
          classNames={['overlay-button']}
          onClick={props.discard ? props.discard : undefined}
        ></Button>
      </div>
    </>
  );
}

Overlay.propTypes = {
  active: PropTypes.bool,
  discard: PropTypes.func,
  onClick: PropTypes.func,
};

export default Overlay;
