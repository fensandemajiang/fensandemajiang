import React from "react";
import PropTypes, {InferProps} from "prop-types"
import DiscardedTile from "./DiscardedTile/DiscardedTile";
import "./Discards.css"

function Discards(props: InferProps<typeof Discards.propTypes>){

    const num_discards = 2;
    const total = 8;
    const discards = []

    for(let i = 0; i < total; i++){
        if(i < num_discards){
            discards.push(<DiscardedTile type={0} orientation={props.orientation}></DiscardedTile>)
        }else{
            discards.push(<DiscardedTile orientation={props.orientation}></DiscardedTile>)
        }
       
    }

    return (
        <>
            <div className={"discards discard-" + (props.orientation ? props.orientation : "right")}>
                {discards}
            </div>
        </>
    )
}

Discards.propTypes = {
    any: PropTypes.any,
    orientation: PropTypes.string
}

export default Discards

