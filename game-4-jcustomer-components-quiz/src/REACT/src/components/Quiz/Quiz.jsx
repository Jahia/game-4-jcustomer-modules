import React from 'react';
import PropTypes from "prop-types";
import {Col, Button, Carousel} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Quiz = (props) => {
    const {files_endpoint} =  React.useContext(JContext);

    // const quiz = {
    //     title: get(props.quizData, "title", ""),
    //     subtitle: get(props.quizData, "subtitle.value", ""),
    //     description: get(props.quizData, "description.value", ""),
    //     duration: get(props.quizData, "duration.value", ""),
    //     ctaLink: get(props.quizData, "ctaLink.value", ""),
    //     cover: get(props.quizData, "cover.node.path", ""),
    //     consent: get(props.quizData, "consent.node.uuid", ""),
    // };

    return(
        <div className={`game4-quiz__item show-overlay ${props.show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${encodeURI(props.quiz.cover)}`}
                 alt={props.quiz.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{props.quiz.title}<span className="subtitle">{props.quiz.subtitle}</span></h2>
                <div className="lead" dangerouslySetInnerHTML={{__html:props.quiz.description}}></div>
                <Button variant="game4-quiz"
                        onClick={props.onClickNext}
                        disabled={!props.showNext}>
                    Commencer
                </Button>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {props.quiz.duration}
                </div>
            </div>
        </div>
    );
}

Quiz.propTypes={
    quiz:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    showNext:PropTypes.bool.isRequired
}

export default Quiz;