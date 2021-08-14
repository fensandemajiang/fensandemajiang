import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import DeckTile from './DeckTile/DeckTile';
import './Deck.css';

function Deck(props: InferProps<typeof Deck.propTypes>) {
  const size = 14;

  const tiles = [];

  for (let i = 0; i < size; i++) {
    tiles.push(<DeckTile discard={props.discard} index={i}></DeckTile>);
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
};

export default Deck;
