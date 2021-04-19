import React from 'react';
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';

const Percentage = ({score}) => {
    console.debug("*** paint percentage result : ",score);
    return(
            <div className="game4-quiz__score-result col-6 offset-3 col-md-4 offset-md-4 mb-5">
                <CircularProgressbar value={score} text={`${score}%`}/>
            </div>
    );
}

Percentage.propTypes={
    score:PropTypes.number.isRequired
}

export default Percentage;