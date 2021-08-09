import React, {MouseEvent}  from "react"
import PropTypes, { InferProps } from 'prop-types';
import Tile from "./Tile/Tile";
import "./Deck.css"

function Deck(props: InferProps<typeof Deck.propTypes>) {

    const size : number = 14;

    const tiles = []
    
    for(let i:number = 0; i < size; i++){
        tiles.push(
            <Tile></Tile>
        )
    }

    return (
        <>  
            <div className="deck-container">
                <div className="deck">
                    {tiles}
                </div>
            </div>
        </>
    )
}

Deck.propTypes = {
    any: PropTypes.any
}

export default Deck;
