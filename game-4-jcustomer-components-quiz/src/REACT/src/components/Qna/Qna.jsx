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

class _Qna{
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    constructor(qnaData,quiz_validMark) {
        // console.log("Warmup : ",quiz);
        this.title= get(qnaData, "title");
        this.question= get(qnaData, "question.value", "");
        this.help= get(qnaData, "help.value", "");
        this.nbExpectedAnswer= get(qnaData, "nbExpectedAnswer.value", "");
        this.randomSelection= JSON.parse(get(qnaData, "randomSelection.value", false));
        this.notUsedForScore= JSON.parse(get(qnaData, "notUsedForScore.value", false));
        this.cover= get(qnaData, "cover.node.path", "");
        this.jExpField2Map= get(qnaData, "jExpField2Map.value", "");
        this.answers= get(qnaData, "answers.values", []).map(answer=>{
            const valid = answer.indexOf(quiz_validMark) === 0;
            if(valid)
                answer = answer.substring(quiz_validMark.length+1);//+1 is for space between mark and label

            return {label:answer,checked:false,valid}
        })
    };
    valid() {
        if(this.notUsedForScore)
            return true;

        console.log("qna isValid start eval");
        const isValid = this.answers.reduce((result,answer)=>{
            if(answer.valid)
                result.push(answer.checked);
            return result;
        },[]).reduce((result,checked) => result && checked,true);
        console.log("qna isValid : ",isValid);
        return isValid;
    };
}


// const Qna = ({id,show,quizKey,setShowResult}) => {
const Qna = (props) => {
    const {gql_variables,files_endpoint,quiz_validMark} =  React.useContext(JContext);
    const variables = Object.assign(gql_variables,{id:props.id})
    const {loading, error, data} = useQuery(GET_QNA, {
        variables:variables,
    });

    const [answers, setAnswers] = React.useState([]);
    const [qna, setQna] = React.useState({answers:[]});
    const [disableSubmit, setDisableSubmit] = React.useState(true);

    React.useEffect(() => {

        if(loading === false && data){

            const qnaData = get(data, "response.qna", {});
            console.log("Qna ",qnaData.id," : init");

            // const qna = {
            //     title: get(qnaData, "title"),
            //     question: get(qnaData, "question.value", ""),
            //     help: get(qnaData, "help.value", ""),
            //     nbExpectedAnswer: get(qnaData, "nbExpectedAnswer.value", ""),
            //     randomSelection: get(qnaData, "randomSelection.value", ""),
            //     notUsedForScore: get(qnaData, "notUsedForScore.value", ""),
            //     cover: get(qnaData, "cover.node.path", ""),
            //     jExpField2Map: get(qnaData, "jExpField2Map.value", ""),
            // };
            //
            // qna.answers= get(qnaData, "answers.values", []).map(answer=>{
            //     const valid = answer.indexOf(quiz_validMark) === 0;
            //     if(valid)
            //         answer = answer.substring(quiz_validMark.length+1);//+1 is for space between mark and label
            //
            //     return {label:answer,checked:false,valid}
            // })
            // setQna(qna);
            setQna(new _Qna(qnaData,quiz_validMark));
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
        props.setResultSet([...props.resultSet,qna.valid()]);

        if(qna.jExpField2Map){
            //Get response label
            const values = qna.answers.filter(answers => answers.checked);
            //TODO manage case multiple later
            //TODO do the call from tracker
        }
    }

    //TODO revoir le layer visible si showResult
    return(
        <div className={`game4-quiz__item show-overlay ${props.show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${qna.cover}`}
                 alt={qna.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <fieldset>
                    <legend>{qna.question}
                        <span>{qna.help}</span>
                    </legend>
                    <div className="game4-quiz__answer-list">
                    {qna.answers.map((answer,i)=>
                        <Answer
                            key={i}
                            answer={answer}
                            handleDisableSubmit={handleDisableSubmit}
                        />)
                    }
                    </div>
                </fieldset>

                <Button variant="game4-quiz"
                        onClick={handleSubmit}
                        disabled={disableSubmit}>
                    Submit
                </Button>

            </div>
        </div>
    );
}

Qna.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    quizKey:PropTypes.string.isRequired,
    resultSet:PropTypes.array.isRequired,
    setResultSet:PropTypes.func.isRequired
}

export default Qna;