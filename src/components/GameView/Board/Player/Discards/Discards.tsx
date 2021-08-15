import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import DiscardedTile from './DiscardedTile/DiscardedTile';
import './Discards.css';
import type { Tile } from "../../../../../types"
import { Suite } from "../../../../../types"

function Discards(props: InferProps<typeof Discards.propTypes>) {
  function makeDeck(): Tile[]{
    const ret: Tile[] = []
    for( let i = 0; i < 7; i++){
      const tile: Tile = {
        suite: Suite.Tong,
        value: i+1
      }
      ret.push(tile)
    }
    return ret
  }
  // const discarded_tiles = props.discards ? props.discards :
  const discarded_tiles = makeDeck();
  const num_discards = discarded_tiles.length
  const total = 10;
  const discards = [];

  for (let i = 0; i < total; i++) {
    if (i < num_discards) {
      discards.push(
        <DiscardedTile
          tile={discarded_tiles[i]}
          orientation={props.orientation}
        ></DiscardedTile>,
      );
    }
    // } else {
    //   discards.push(
    //     <DiscardedTile orientation={props.orientation}></DiscardedTile>,
    //   );
    // }   
  }

  return (
    <>
      <div
        className={
          'discards discard-' +
          (props.orientation ? props.orientation : 'right')
        }
      >
        {discards}
      </div>
    </>
  );
}

Discards.propTypes = {
  any: PropTypes.any,
  orientation: PropTypes.string,
  discards: PropTypes.array
};

export default Discards;
