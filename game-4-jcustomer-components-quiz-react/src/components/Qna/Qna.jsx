import React from 'react';
import PropTypes from "prop-types";

import {useQuery} from "@apollo/react-hooks";
import get from "lodash.get";

import {StoreContext} from "contexts";

import {GET_QNA} from "./QnaGraphQL";
import Answer from "./Answer";

import QnaMapper from "components/Qna/QnaModel";
import {syncVisitorData} from "misc/tracker";
import Media from "components/Media";
import cssSharedClasses from "components/cssSharedClasses";
import classnames from "clsx";
import {FormGroup, Typography,Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Header from "components/Header/Header";


const useStyles = makeStyles(theme => ({
    questionGroup:{
        textAlign:'left',
        marginTop: `${theme.spacing(2)}px`,
        marginBottom: `${theme.spacing(4)}px`,
    },
    question:{
        marginBottom: `${theme.spacing(1)}px`,
    },
    formGroup: {
        textAlign:'left',
        "& > div::before":{
            flexBasis:'100%',
            content:'""',
            height: '2px',
            marginLeft : '50px',
            borderTop: '2px solid rgba(255,255,255,.2)',
        },
        "&  > div:first-child::before":{
            borderTop: 'none',
        },
        "&  > div:last-child::after":{
            flexBasis:'100%',
            content:'""',
            height: '2px',
            marginLeft : '50px',
            borderBottom: '2px solid rgba(255,255,255,.2)',
        },
        marginBottom:`${theme.spacing(4)}px`
    },
}));


const initialQNA = {
    enableSubmit:false,
}

const reducer = (qna, action) => {
    const { payload } = action;

    switch (action.case) {
        case "DATA_READY": {
            // const {qnaData,quiz_validMark} = payload;
            const {qnaData} = payload;
            console.debug("[QNA] DATA_READY -> qnaData :",qnaData);

            return {
                ...qna,
                ...QnaMapper(qnaData)
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
            const {qnaData} = payload;
            console.debug("[QNA] RESET -> qnaData :",qnaData);
            return{
                ...initialQNA,
                ...QnaMapper(qnaData)
            }
        }
        default:
            throw new Error(`[QNA] action case '${action.case}' is unknown `);
    };
}

const Qna = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const { state, dispatch } = React.useContext(StoreContext);
    const { currentSlide,jContent,reset,showScore } = state;
    const { gql_variables,language_bundle } =  jContent;

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
                    qnaData
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
                    qnaData
                }
            });
        }
    }, [reset,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.debug("*** paint qna : ",qna.title);

    const show = currentSlide === props.id;

    const handleSubmit = () => {
        if(qna.notUsedForScore){
            if(showScore){
                dispatch({
                    case:"SHOW_SCORE"
                });
            }else{
                dispatch({
                    case:"NEXT_SLIDE"
                });
            }
        }else{
            dispatch({
                case:"SHOW_RESULT",
                payload:{
                    result: qna.answers
                            .filter(answer => answer.isAnswer)
                            .reduce( (test,answer) => test && answer.checked,true)
                }
            });
        }
        // dispatch({
        //     case:"SHOW_RESULT",
        //     payload:{
        //         result:qna.notUsedForScore ?
        //                 true :
        //                 qna.answers
        //                 .filter(answer => answer.isAnswer)
        //                 .reduce( (test,answer) => test && answer.checked,true)
        //     }
        // });

        // console.log("[handleSubmit] qna.jExpField2Map => ",qna.jExpField2Map);
        if(qna.jExpField2Map){
            //Get response cdpValue
            //Note case multiple is manage by comma separated case
            const values =
                qna.answers
                .filter(answer => answer.checked)
                .reduce(
                    (item,answer,index) =>{
                        if(answer.cdpValue && answer.cdpValue.length > 0) {
                            if (index === 0) {
                                //workaround
                                let cdpValue = answer.cdpValue;
                                if(cdpValue==='true') cdpValue=true;
                                if(cdpValue==='false') cdpValue=false;
                                item = cdpValue
                            } else {
                                item = `${item}, ${answer.cdpValue}`
                            }
                        }
                        return item;
                    },null
                );
            // console.debug("[handleSubmit] update : ",qna.jExpField2Map," with values : ",values);

            //if tracker is not initialized the track event is not send
            syncVisitorData({
                propertyName:`properties.${qna.jExpField2Map}`,
                propertyValue:values
            })
        }
    }

    const getAnswers = () => {
        if(qna.answers)
            return qna.answers.map( answer =>
                <Answer
                    key={answer.id}
                    id={answer.id}
                    qna={qna}
                    qnaDispatch={qnaDispatch}
                />);
    }

    return(
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            <Header/>

            {qna.media &&
                <Media id={qna.media.id}
                       type={qna.media.type.value}
                       mixins={qna.media.mixins.map(mixin=>mixin.value)}
                       path={qna.media.path}
                       alt={qna.title}
                />
            }
            <div className={sharedClasses.caption}>
                <div className={classes.questionGroup}>
                    <Typography  className={classes.question}
                                 variant="h4">
                        {qna.question}
                    </Typography>
                    <Typography variant="h5">
                        {qna.help}
                    </Typography>
                </div>


                {/*<ol className="game4-quiz__answer-list">*/}
                <FormGroup className={classes.formGroup}
                           style={{}}
                           aria-label="answer">
                    {getAnswers()}
                </FormGroup>
                {/*</ol>*/}

                <Button onClick={handleSubmit}
                        disabled={!qna.enableSubmit}>
                    {language_bundle && language_bundle.btnSubmit}
                </Button>
            </div>
        </div>
    );

    // return(
    //     <div className={classnames(
    //         sharedClasses.item,
    //         sharedClasses.showOverlay,
    //         (show ? 'active':'')
    //     )}>
    //         {qna.media &&
    //         <Media id={qna.media.id}
    //                type={qna.media.type.value}
    //                mixins={qna.media.mixins.map(mixin=>mixin.value)}
    //                path={qna.media.path}
    //                alt={qna.title}
    //         />
    //
    //         }
    //
    //         <div className="game4-quiz__caption d-none d-md-block">
    //             <fieldset>
    //                 <legend>{qna.question}
    //                     <i>{qna.help}</i>
    //                 </legend>
    //                 {qna.answers &&
    //                 <ol className="game4-quiz__answer-list">
    //                     {qna.answers.map( answer =>
    //                         <Answer
    //                             key={answer.id}
    //                             id={answer.id}
    //                             qna={qna}
    //                             qnaDispatch={qnaDispatch}
    //                         />)
    //                     }
    //                 </ol>
    //                 }
    //             </fieldset>
    //
    //             <Button variant="game4-quiz"
    //                     onClick={handleSubmit}
    //                     disabled={!qna.enableSubmit}>
    //                 {language_bundle && language_bundle.btnSubmit}
    //             </Button>
    //
    //         </div>
    //     </div>
    // );
}

Qna.propTypes={
    id:PropTypes.string.isRequired
}

export default Qna;