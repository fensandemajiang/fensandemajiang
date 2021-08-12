import React from "react";
import PropTypes, { InferProps } from 'prop-types';
import { Button } from "../../../GlobalComponents/Button/Button" 
import "./ActionButton.css"


function ActionButton(props: InferProps<typeof ActionButton.propTypes>) {
    const textArr: string[] = ["Chow", "Pung", "Kong", "Get Tile"]
    let text = "null"

    if (typeof(props.type) == "number"){
        if(textArr[props.type] != undefined && textArr[props.type] != null){
            text = textArr[props.type]
        } 
    }

    return (
        <>
            <Button 
                text={text} 
                classNames={["action-button"]} 
                {...props.otherProps}
            ></Button>
        </>
    )
}

ActionButton.propTypes = {
    type: PropTypes.number,
    otherProps: PropTypes.object
}

export default ActionButton;
