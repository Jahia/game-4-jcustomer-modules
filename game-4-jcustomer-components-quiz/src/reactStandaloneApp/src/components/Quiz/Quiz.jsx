import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Col, Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Quiz = ({quizData,showQuiz,start,disabled}) => {
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
        <Col className={`slide quiz ${showQuiz?'':'d-none'}`}>
            <img src={`${files_endpoint}${quiz.cover}`} className="cover" alt={quiz.title}/>
            <h2>{quiz.title}
                <span>{quiz.subtitle}</span>
            </h2>
            <div className={"content"}>
                <div dangerouslySetInnerHTML={{__html:quiz.description}}></div>

                <Button variant="elearning"
                        onClick={start}
                        disabled={disabled}>
                    Start
                </Button>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {quiz.duration}
                </div>
            </div>
        </Col>
    );
}

Quiz.propTypes={
    quizData:PropTypes.object.isRequired,
    start:PropTypes.func.isRequired,
    showQuiz:PropTypes.bool.isRequired,
    disabled:PropTypes.bool.isRequired
}

export default Quiz;