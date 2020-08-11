import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import {useQuery} from "@apollo/react-hooks";
import get from "lodash.get";
import {JContext} from "contexts";
import uTracker from "unomi-analytics";

import {GET_QNA} from "./QnaGraphQL";
import Answer from "./Answer";
import {getRandomString} from "misc/utils";

class _Qna{
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    constructor(qnaData,quiz_validMark) {
        // console.log("Warmup : ",quiz);
        this.id= get(qnaData, "id");
        this.title= get(qnaData, "title");
        this.question= get(qnaData, "question.value", "");
        this.help= get(qnaData, "help.value", "");
        // this.nbExpectedAnswer= get(qnaData, "nbExpectedAnswer.value", "");
        this.randomSelection= JSON.parse(get(qnaData, "randomSelection.value", false));
        this.notUsedForScore= JSON.parse(get(qnaData, "notUsedForScore.value", false));
        this.cover= get(qnaData, "cover.node.path", "");
        this.jExpField2Map= get(qnaData, "jExpField2Map.value", "");
        this.answers= get(qnaData, "answers.values", []).map(answer=>{
            const id = getRandomString(5,"#aA");
            const valid = answer.indexOf(quiz_validMark) === 0;
            if(valid)
                answer = answer.substring(quiz_validMark.length+1);//+1 is for space between mark and label

            return {id,label:answer,checked:false,valid}
        })
        if(this.randomSelection)
            this.answers.sort( (a,b) => a.id > b.id );

        this.computedNbExpectedAnswer = this.answers.filter(answer => answer.valid).length;
    };
    // getNbExpectedAnswer(){
    //     return this.answers.filter(answer => answer.valid).length;
    // };

    valid() {
        console.log("qna isValid this.notUsedForScore : ",this.notUsedForScore);
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

const Qna = (props) => {

    const {gql_variables,files_endpoint,quiz_validMark,language_bundle} =  React.useContext(JContext);
    const variables = Object.assign(gql_variables,{id:props.id})
    const {loading, error, data} = useQuery(GET_QNA, {
        variables:variables,
    });

    // const [answers, setAnswers] = React.useState([]);
    const [qna, setQna] = React.useState({answers:[]});
    const [disableSubmit, setDisableSubmit] = React.useState(true);
    const [checked, setChecked] = React.useState([]);

    React.useEffect(() => {

        if(loading === false && data){
            const qnaData = get(data, "response.qna", {});
            // console.log("Qna ",qnaData.id," : init");
            setQna(new _Qna(qnaData,quiz_validMark));
        }

    }, [loading,data]);

    React.useEffect(() => {
        let disable = true;//used to handleDisableSubmit

        qna.answers.forEach(answer=>{
            answer.checked = checked.includes(answer.id);
            if(answer.checked)
                disable = false;
        })
        // console.log("qna.answers : ",qna.answers);
        // setQna(qna);
        setDisableSubmit(disable);

    }, [checked]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const {currentSlide} = props.state;
    const show = currentSlide === props.id;

    const handleChange= (e) => {
        // console.log("handleChange : ",e.target.id);
        // console.log("qna.computedNbExpectedAnswer : ",qna.computedNbExpectedAnswer);

        if(qna.computedNbExpectedAnswer <= 1){//case radio, <=1 is required to manage question not used for score
            setChecked(e.target.id)
        }else {//case checkbox
            const index = checked.indexOf(e.target.id);
            if(index === -1){//checked
                setChecked([...checked, e.target.id]);
            }else{//unchecked
                checked.splice(index,1);
                setChecked([...checked]);
            }
        }
    }

    const handleSubmit = () => {

        console.log("[handleSubmit] qna.valid() => ",qna.valid());
        props.dispatch({
            case:"SHOW_RESULT",
            result:qna.valid()
        });

        // props.setResultSet([...props.resultSet,qna.valid()]);
        // console.log("[handleSubmit] qna.jExpField2Map => ",qna.jExpField2Map);
        if(qna.jExpField2Map){
            //Get response label
            //TODO manage case multiple later
            const values =
                qna.answers
                .filter(answers => answers.checked)
                .reduce(
                    (label,answer) =>
                        (answer.label && 0 < answer.label.length)
                            ?answer.label
                            :null
                    ,null
                );

            //if tracker is not initialized the track event is not send
            // console.debug("[handleSubmit] update : ",qna.jExpField2Map," with values : ",values);
            uTracker.track("updateVisitorData",{
                update : {
                    propertyName:`properties.${qna.jExpField2Map}`,
                    propertyValue:values
                }
            });
        }
    }

    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${qna.cover}`}
                 alt={qna.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <fieldset>
                    <legend>{qna.question}
                        <i>{qna.help}</i>
                    </legend>
                    <ol className="game4-quiz__answer-list">
                        {qna.answers.map((answer,i)=>
                            <Answer
                                key={i}
                                qna={qna}
                                answer={answer}
                                checked={checked.includes(answer.id)}
                                handleChange={handleChange}
                            />)
                        }
                    </ol>

                </fieldset>

                <Button variant="game4-quiz"
                        onClick={handleSubmit}
                        disabled={disableSubmit}>
                    {language_bundle && language_bundle.btnSubmit}
                </Button>

            </div>
        </div>
    );
}

Qna.propTypes={
    id:PropTypes.string.isRequired,
    state:PropTypes.object.isRequired,
    dispatch:PropTypes.func.isRequired
}

export default Qna;