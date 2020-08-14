import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import {useQuery} from "@apollo/react-hooks";
import get from "lodash.get";

import {StoreContext} from "contexts";

import {GET_QNA} from "./QnaGraphQL";
import Answer from "./Answer";

import QnaMapper from "components/Qna/QnaModel";
import {syncVisitorData} from "misc/tracker";

const initialQNA = {
    enableSubmit:false,
}

const reducer = (qna, action) => {
    const { payload } = action;

    switch (action.case) {
        case "DATA_READY": {
            const {qnaData,quiz_validMark} = payload;
            console.debug("[QNA] DATA_READY -> qnaData :",qnaData);

            return {
                ...qna,
                ...QnaMapper(qnaData,quiz_validMark)
            }
        }
        case "TOGGLE_ANSWER": {
            const {answer} = payload;//answer id
            console.debug("[QNA] TOGGLE_ANSWER -> answer :",answer);
            let {answers} = qna;
            if(qna.inputType === "radio")
                answers = answers.map( answer =>{ return {...answer,checked:false} });

            answers = answers.map(_answer => {
                if(_answer.id === answer.id)
                    return {
                        ..._answer,
                        checked:!_answer.checked
                    };
                return _answer
            });
            const enableSubmit = answers.filter(answer => answer.checked).length > 0

            return{
                ...qna,
                answers,
                enableSubmit
            }
        }
        case "RESET":{
            const {qnaData,quiz_validMark} = payload;
            console.debug("[QNA] RESET -> qnaData :",qnaData);
            return{
                ...initialQNA,
                ...QnaMapper(qnaData,quiz_validMark)
            }
        }
        default:
            throw new Error(`[QNA] action case '${action.case}' is unknown `);
    };
}

const Qna = (props) => {
    const { state, dispatch } = React.useContext(StoreContext);
    const { currentSlide,jContent,reset } = state;
    const { gql_variables,files_endpoint,quiz_validMark,language_bundle } =  jContent;

    const variables = Object.assign(gql_variables,{id:props.id})
    const {loading, error, data} = useQuery(GET_QNA, {
        variables:variables,
    });

    const [qna, qnaDispatch] = React.useReducer(
        reducer,
        initialQNA
    );

    React.useEffect(() => {
        if(loading === false && data){
            const qnaData = get(data, "response.qna", {});
            qnaDispatch({
                case:"DATA_READY",
                payload:{
                    qnaData,
                    quiz_validMark
                }
            });
        }
    }, [loading,data]);

    React.useEffect(() => {
        if(reset && data){
            const qnaData = get(data, "response.qna", {});
            qnaDispatch({
                case:"RESET",
                payload:{
                    qnaData,
                    quiz_validMark
                }
            });
        }
    }, [reset,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.debug("*** paint qna : ",qna.title);

    const show = currentSlide === props.id;

    const handleSubmit = () => {

        dispatch({
            case:"SHOW_RESULT",
            payload:{
                result:qna.notUsedForScore ?
                        true :
                        qna.answers
                        .filter(answer => answer.valid)
                        .reduce( (test,answer) => test && answer.checked,true)
            }
        });

        // console.log("[handleSubmit] qna.jExpField2Map => ",qna.jExpField2Map);
        if(qna.jExpField2Map){
            //Get response label
            //TODO manage case multiple later
            const values =
                qna.answers
                .filter(answer => answer.checked)
                .reduce(
                    (label,answer) =>
                        (answer.label && answer.label.length > 0) ?
                            answer.label :
                            null
                    ,null
                );
            // console.debug("[handleSubmit] update : ",qna.jExpField2Map," with values : ",values);

            //if tracker is not initialized the track event is not send
            syncVisitorData({
                propertyName:`properties.${qna.jExpField2Map}`,
                propertyValue:values
            })
        }
    }

    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            {qna.cover &&
                <img className="d-block w-100"
                     src={`${files_endpoint}${encodeURI(qna.cover)}`}
                     alt={qna.title}/>
            }

            <div className="game4-quiz__caption d-none d-md-block">
                <fieldset>
                    <legend>{qna.question}
                        <i>{qna.help}</i>
                    </legend>
                    {qna.answers &&
                        <ol className="game4-quiz__answer-list">
                            {qna.answers.map( answer =>
                                <Answer
                                    key={answer.id}
                                    id={answer.id}
                                    qna={qna}
                                    qnaDispatch={qnaDispatch}
                                />)
                            }
                        </ol>
                    }
                </fieldset>

                <Button variant="game4-quiz"
                        onClick={handleSubmit}
                        disabled={!qna.enableSubmit}>
                    {language_bundle && language_bundle.btnSubmit}
                </Button>

            </div>
        </div>
    );
}

Qna.propTypes={
    id:PropTypes.string.isRequired
}

export default Qna;