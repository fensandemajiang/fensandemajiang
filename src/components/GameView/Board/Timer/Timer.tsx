import React from "react";
import PropTypes, { InferProps } from 'prop-types';
import "./Timer.css"

function Timer(props: InferProps<typeof Timer.propTypes>) {
    return (
        <>
            <div className="timer-container">
                <div className="timer">
                    Time left: 0:03
                </div>
            </div>
        </>
    )
}

Timer.propTypes = {
    any: PropTypes.any
}

export default Timer;
