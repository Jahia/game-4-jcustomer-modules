import React from 'react';
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';
import {Col, Button, Carousel} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Score = (props) => {
    const {files_endpoint} =  React.useContext(JContext);
    console.log("Score props.show :",props.show);
    return(
        <div className={`game4-quiz__item show-overlay ${props.show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${encodeURI(props.quiz.cover)}`}
                 alt={props.quiz.title}/>

            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{props.quiz.title}<span className="subtitle">{props.quiz.subtitle}</span></h2>
                <div className="game4-quiz__score-result col-6 offset-3 col-md-4 offset-md-4">
                    <CircularProgressbar value={props.score()} text={`${props.score()}%`}/>
                </div>
            </div>
        </div>
    );
}

Score.propTypes={
    quiz:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    score:PropTypes.func.isRequired
}

export default Score;