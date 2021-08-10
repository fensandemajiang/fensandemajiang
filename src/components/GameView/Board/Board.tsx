import React, {MouseEvent}  from "react"
import PropTypes, { InferProps } from 'prop-types';
import Timer from "./Timer/Timer";
import Player from "./Player/Player";
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
                <div className="board">
                    <Timer></Timer>
                    <Player></Player>
                    <Player orientation="up"></Player>
                    <Player orientation="left"></Player>
                </div>
            </div>
        </>
    )
}

Board.propTypes = {
    any: PropTypes.any
}

export default Board;
