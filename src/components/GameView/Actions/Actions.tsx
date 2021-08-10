import React from "react";
import PropTypes, { InferProps } from 'prop-types';
import ActionButton from "./Buttons/ActionButton";
import Timer from "../Board/Timer/Timer";
import "./Actions.css";

function Actions(props: InferProps<typeof Actions.propTypes>) {


    // let onClick = (e: MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()
    //     if(props.onClick != undefined && props.onClick != null){
    //         props.onClick(props.type)
    //     } else {
    //         return null;
    //     }
    // }

    return (
        <>
            <div className="actions-container">
                <div className="actions">
                    <ActionButton type={0} otherProps={{"onClick": () => alert("you clicked")}}></ActionButton>
                    <ActionButton type={1} otherProps={{"onClick": () => alert("you clicked")}}></ActionButton>
                    <ActionButton type={2} otherProps={{"onClick": () => alert("you clicked")}}></ActionButton>
                </div>
            </div>
        </>
    )
}

Actions.propTypes = {
    any: PropTypes.any
}

export default Actions;
