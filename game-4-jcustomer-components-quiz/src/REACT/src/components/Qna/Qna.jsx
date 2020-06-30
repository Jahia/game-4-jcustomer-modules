import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Col, Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useQuery} from "@apollo/react-hooks";
import {GET_QNA} from "./QnaGraphQL";

const Qna = ({id,show,childIndex,setChildIndex,max,getFinalScore,quizKey}) => {
    const {gql_variables} =  useContext(JContext);
    const variables = Object.assign(gql_variables,{id:id})

    const {loading, error, data} = useQuery(GET_QNA, {
        variables:variables,
    });
    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const qnaData = get(data, "response.qna", {});
    
    const qna = {
        title: get(qnaData, "title", ""),
        question: get(qnaData, "question.value", ""),
        help: get(qnaData, "help.value", ""),
        nbExpectedAnswer: get(qnaData, "nbExpectedAnswer.value", ""),
        answers: get(qnaData, "answers.values", ""),
        randomSelection: get(qnaData, "randomSelection.value", ""),
        notUsedForScore: get(qnaData, "notUsedForScore.value", ""),
        cover: get(qnaData, "cover.node.path", ""),
        jExpField2Map: get(qnaData, "jExpField2Map.value", ""),
    };

    return(
        <></>
        // <Col className={`slide quiz ${showQuiz?'':'d-none'}`}>
        //     <img src={`${files_endpoint}${quiz.cover}`} className="cover" alt={quiz.title}/>
        //     <h2>{quiz.title}
        //         <span>{quiz.subtitle}</span>
        //     </h2>
        //     <div className={"content"}>
        //         <div dangerouslySetInnerHTML={{__html:quiz.description}}></div>
        //
        //         <Button variant="game4-quiz"
        //                 onClick={start}
        //                 disabled={disabled}>
        //             Start
        //         </Button>
        //
        //         <div className={"duration"}>
        //             <FontAwesomeIcon icon={['far','clock']} />
        //             {quiz.duration}
        //         </div>
        //     </div>
        // </Col>
    );
}

Qna.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    childIndex:PropTypes.number.isRequired,
    setChildIndex:PropTypes.func.isRequired,
    max:PropTypes.number.isRequired,
    getFinalScore:PropTypes.func.isRequired,
    quizKey:PropTypes.string.isRequired
}

export default Qna;