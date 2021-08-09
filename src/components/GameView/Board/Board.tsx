import React, {MouseEvent}  from "react"
import PropTypes, { InferProps } from 'prop-types';
import ActionButton from "../Actions/Buttons/ActionButton";
import "./Board.css"

function Board(props: InferProps<typeof Board.propTypes>) {


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
            <div className="board-container">
                Helloasdfadfaf
            </div>
        </>
    )
}

Board.propTypes = {
    any: PropTypes.any
}

export default Board;
