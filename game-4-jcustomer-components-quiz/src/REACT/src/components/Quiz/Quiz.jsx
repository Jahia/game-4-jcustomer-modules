import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Col, Button, Carousel} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Quiz = ({quizData,show,onClickNext,showNext}) => {
    const {files_endpoint} =  useContext(JContext);
    
    const quiz = {
        title: get(quizData, "title", ""),
        subtitle: get(quizData, "subtitle.value", ""),
        description: get(quizData, "description.value", ""),
        duration: get(quizData, "duration.value", ""),
        ctaLink: get(quizData, "ctaLink.value", ""),
        cover: get(quizData, "cover.node.path", ""),
        consent: get(quizData, "consent.node.uuid", ""),
    };

    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${quiz.cover}`}
                 alt={quiz.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{quiz.title}<span className="subtitle">{quiz.subtitle}</span></h2>
                <div className="lead" dangerouslySetInnerHTML={{__html:quiz.description}}></div>
                <Button variant="game4-quiz"
                        onClick={onClickNext}
                        disabled={!showNext}>
                    Start
                </Button>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {quiz.duration}
                </div>
            </div>
        </div>

    );
}

Quiz.propTypes={
    quizData:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    showNext:PropTypes.bool.isRequired
}

export default Quiz;