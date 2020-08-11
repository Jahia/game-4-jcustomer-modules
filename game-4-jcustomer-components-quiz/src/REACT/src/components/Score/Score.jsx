import React from 'react';
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';

import {JContext} from "contexts";

const Score = (props) => {
    const {quiz,currentSlide,score} = props.state;
    const show = currentSlide === quiz.scoreIndex;

    const {files_endpoint} =  React.useContext(JContext);
    // console.log("Score props.show :",props.show);
    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${encodeURI(quiz.cover)}`}
                 alt={quiz.title}/>

            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{quiz.title}<span className="subtitle">{quiz.subtitle}</span></h2>
                <div className="game4-quiz__score-result col-6 offset-3 col-md-4 offset-md-4">
                    <CircularProgressbar value={score} text={`${score}%`}/>
                </div>
            </div>
        </div>
    );
}

Score.propTypes={
    state:PropTypes.object.isRequired
}

export default Score;