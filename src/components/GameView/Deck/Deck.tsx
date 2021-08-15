import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import DeckTile from './DeckTile/DeckTile';
import type { Tile } from '../../../types';
import { Wind, Dragon, Flower, Suite } from '../../../types';
import './Deck.css';

function Deck(props: InferProps<typeof Deck.propTypes>) {
  function makeDeck(): Tile[]{
    const ret: Tile[] = []
    for( let i = 0; i < 7; i++){
      const tile: Tile = {
        suite: Suite.Wan,
        value: i+1
      }
      ret.push(tile)
    }
    return ret
  }

  const deck = props.deck ? props.deck.length > 0 ? props.deck : makeDeck() : makeDeck();
  const size = deck.length;

  const tiles = [];

  for (let i = 0; i < size; i++) {
    const tile: Tile = deck[i];

    tiles.push(<DeckTile discard={props.discard} index={i} tile={tile}></DeckTile>);
  }

  return (
    <>
      <div className="deck-container">
        <ol className="deck">{tiles}</ol>
      </div>
    </>
  );
}

Deck.propTypes = {
  any: PropTypes.any,
  discard: PropTypes.func,
  deck: PropTypes.array,
};

export default Deck;
