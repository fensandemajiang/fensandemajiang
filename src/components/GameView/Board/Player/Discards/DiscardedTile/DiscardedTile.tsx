import React from "react";
import PropTypes, {InferProps} from "prop-types"
import "./DiscardedTile.css"

function DiscardedTile(props: InferProps<typeof DiscardedTile.propTypes>){

    const images: string[] = [
        ""
    ]

    let img;
    if(typeof(props.type) == "number"){
        img = <img src={images[props.type]} className="small-tile-image"></img>
    } else{
        img = <div className="no-image"></div>
    }

    let orientation : string = "tile-right"

    if(props.orientation == "left"){
        orientation = "tile-left"
    } else if(props.orientation == "up"){
        orientation = "tile-up"
    }

    return (
        <>
            <div className={"discarded-tile " + orientation}>
                {img}
            </div>
        </>
    )
}

DiscardedTile.propTypes = {
    any: PropTypes.any,
    type: PropTypes.number,
    orientation: PropTypes.string
}

export default DiscardedTile

