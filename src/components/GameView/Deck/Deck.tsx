import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import DeckTile from './DeckTile/DeckTile';
import type { Tile } from '../../../types';
import { Wind, Dragon, Flower, Suite } from '../../../types';
import './Deck.css';

function Deck(props: InferProps<typeof Deck.propTypes>) {
  const deck = props.deck ? props.deck : [];
  const size = deck.length;

  const tiles = [];

  for (let i = 0; i < size; i++) {
    const tile: Tile = deck[i];

    tiles.push(
      <DeckTile
        discard={props.discard}
        key={i}
        index={i}
        tile={tile}
      ></DeckTile>,
    );
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
