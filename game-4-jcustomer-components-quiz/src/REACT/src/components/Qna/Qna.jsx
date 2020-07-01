import React from 'react';
import PropTypes from "prop-types";
import {Col, Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useQuery} from "@apollo/react-hooks";
import {GET_QNA} from "./QnaGraphQL";
import Answer from "./Answer";
import uTracker from "unomi-analytics";

const Qna = ({id,show,quizKey}) => {
    const {gql_variables,files_endpoint,quiz_validMark} =  React.useContext(JContext);
    const variables = Object.assign(gql_variables,{id:id})
    const {loading, error, data} = useQuery(GET_QNA, {
        variables:variables,
    });

    const [answers, setAnswers] = React.useState([]);
    const [qna, setQna] = React.useState({answers:[]});
    const [showResult, setShowResult] = React.useState(false);
    const [disableSubmit, setDisableSubmit] = React.useState(true);

    React.useEffect(() => {

        if(loading === false && data){
            console.log("Qna init");
            const qnaData = get(data, "response.qna", {});

            const qna = {
                title: get(qnaData, "title"),
                question: get(qnaData, "question.value", ""),
                help: get(qnaData, "help.value", ""),
                nbExpectedAnswer: get(qnaData, "nbExpectedAnswer.value", ""),
                randomSelection: get(qnaData, "randomSelection.value", ""),
                notUsedForScore: get(qnaData, "notUsedForScore.value", ""),
                cover: get(qnaData, "cover.node.path", ""),
                jExpField2Map: get(qnaData, "jExpField2Map.value", ""),
            };

            qna.answers= get(qnaData, "answers.values", []).map(answer=>{
                const valid = answer.indexOf(quiz_validMark) === 0;
                if(valid)
                    answer = answer.substring(quiz_validMark.length+1);//+1 is for space between mark and label

                return {label:answer,checked:false,valid}
            })
            setQna(qna);
        }

    }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleDisableSubmit = () => {
        // console.log("qna.answers :",qna.answers);
        let disable = true;
        qna.answers.forEach(answer => {
            // console.log("answer.label :",answer.label,"answer.checked :",answer.checked);
            if(answer.checked)
                disable = false;
        })
        setDisableSubmit(disable);
    }

    const handleSubmit = () => {
        //TODO informer le Quiz que la bar de result doit etre affichée
        setShowResult(true);
    }

    //TODO ajouter un layer visible si showResult et masquer le button submit
    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${qna.cover}`}
                 alt={qna.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <fieldset>
                    <legend>{qna.question}
                        <span>{qna.help}</span>
                    </legend>
                    <div className={`game4-quiz__answer-list ${showResult?"show-result":""}`}>
                    {qna.answers.map((answer,i)=>
                        <Answer
                            key={i}
                            answer={answer}
                            handleDisableSubmit={handleDisableSubmit}
                        />)
                    }
                    </div>
                </fieldset>
                {!showResult &&
                    <Button variant="game4-quiz"
                            onClick={handleSubmit}
                            disabled={disableSubmit}>
                        Submit
                    </Button>
                }
            </div>
        </div>
    );
}

Qna.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    quizKey:PropTypes.string.isRequired
}

export default Qna;