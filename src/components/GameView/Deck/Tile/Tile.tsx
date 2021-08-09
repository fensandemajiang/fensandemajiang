import React from "react"
import PropTypes, { InferProps } from 'prop-types';
import "./Tile.css"

function Tile(props: InferProps<typeof Tile.propTypes>) {
    return (
        <>
            <div className="deck-tile-container">
                <div className="deck-tile">
                </div>
            </div>
            
        </>
    )
}

Tile.propTypes = {
    any: PropTypes.any
}

export default Tile;
