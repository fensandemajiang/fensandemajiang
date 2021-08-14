import React, { MouseEvent, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Tile from '@components/GlobalComponents/Tile/Tile';
import Overlay from './Overlay/Overlay';
import './DeckTile.css';

function DeckTile(props: InferProps<typeof DeckTile.propTypes>) {
  const [overlay, setOverlay] = useState(false);
  const [hover, setHover] = useState('');
  const [click, setClick] = useState('');

  function toggle(value: any, setValue: any, falseValue: any, trueValue: any) {
    if (value) {
      setValue(falseValue);
    } else {
      setValue(trueValue);
    }
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    toggle(overlay, setOverlay, false, true);
    toggle(click, setClick, '', 'tile-click');
    setHover('tile-hover');
  }

  function onMouseLeave() {
    setHover('');
    setOverlay(false);
    setClick('');
  }

  function discard() {
    if (
      props.discard &&
      (typeof props.type == 'number' || typeof props.index == 'number')
    ) {
      props.discard(props.type, props.index);
    }
  }

  return (
    <>
      <li
        className="deck-tile-container"
        key={props.index ? props.index : undefined}
        onMouseLeave={onMouseLeave}
      >
        <Tile onClick={onClick} className={hover + ' ' + click}></Tile>
        <Overlay active={overlay} discard={discard} onClick={onClick}></Overlay>
      </li>
    </>
  );
}

DeckTile.propTypes = {
  any: PropTypes.any,
  discard: PropTypes.func,
  type: PropTypes.number,
  index: PropTypes.number,
};

export default DeckTile;
