import React from "react";
import PropTypes, {InferProps} from "prop-types"
import "./UprightTile.css"

function UprightTile(props: InferProps<typeof UprightTile.propTypes>){

    return (
        <>
            <div className="upright-tile">
            </div>
        </>
    )
}

UprightTile.propTypes = {
    any: PropTypes.any
}

export default UprightTile

