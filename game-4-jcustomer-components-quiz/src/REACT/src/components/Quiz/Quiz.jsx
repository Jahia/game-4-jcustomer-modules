import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import {StoreContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Consent from "components/Consent";

const init = variables =>{
    return {
        ...variables,
        consents:[]//list of consent
    }
}

function reducer(state, action) {
    const { payload } = action;

    const computeEnableStartBtn = ({consents = state.consents}) => {
        const {showNext,workspace} = state;

        if(showNext && workspace !== "LIVE")
            return true;

        const granted = consents.filter( consent => consent.checked || consent.granted );
        return consents.length === granted.length;
    }

    switch (action.case) {
        case "ADD_CONSENT":{
            let {consents} = state;
            const {consent} = payload;

            return{
                ...state,
                consents:[...consents,consent],
                enableStartBtn:computeEnableStartBtn({consents:[...consents,consent]})
            }
        }
        case "DENIED_CONSENT":{
            const {consents} = state;
            const {consent} = payload;

            return{
                ...state,
                consents:consents.map(_consent => {
                    if(_consent.id === consent.id)
                        return consent;
                    return _consent
                }),
                enableStartBtn:false
            }
        }
        case "TOGGLE_CONSENT": {
            const {consents} = state;
            const {consent} = payload;

            return{
                ...state,
                consents:consents.map(_consent => {
                    if(_consent.id === consent.id)
                        return consent;
                    return _consent
                }),
                enableStartBtn:computeEnableStartBtn({consents:[...consents,consent]})
            }
        }
        default:
            throw new Error(`QUIZ action case '${action.case}' is unknown `);
    }
}

//TODO create a reducer to simplify the stuff!
const Quiz = (props) => {
    const { state, dispatch } = React.useContext(StoreContext);

    const {quiz,showNext,currentSlide,jContent,cxs} = state;
    const {files_endpoint,consent_status,scope,gql_variables,language_bundle} = jContent;

    const [quizState, quizDispatch] = React.useReducer(
        reducer,
        {
            enableStartBtn: showNext && gql_variables.workspace !== "LIVE",
            workspace:gql_variables.workspace,
            showNext
        },
        init
    );

    const show = currentSlide === quiz.id;

    const onClick = () => {
        quizState.consents.forEach(consent=>{
            //already granted nothing to do
            if(consent.granted)
                return;

            consent.syncStatus({scope,status:consent_status.GRANTED});
        })

        dispatch({
            case:"NEXT_SLIDE"
        });
    };

    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            {quiz.cover &&
                <img className="d-block w-100"
                     src={`${files_endpoint}${encodeURI(quiz.cover)}`}
                     alt={quiz.title}/>
            }

            <div className="game4-quiz__caption">
                <h2 className="text-uppercase">{quiz.title}
                    <span className="subtitle">{quiz.subtitle}</span>
                </h2>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {quiz.duration}
                </div>

                <div className="lead" dangerouslySetInnerHTML={{__html:quiz.description}}></div>

                <Button variant="game4-quiz"
                        onClick={onClick}
                        disabled={!quizState.enableStartBtn}>
                    {language_bundle && language_bundle.btnStart}
                </Button>
            </div>
            {
                quiz.consents.length > 0 && cxs &&
                <div className="game4-quiz__consent">
                    <h5>{language_bundle && language_bundle.consentTitle}</h5>
                    <ul>
                        {
                            quiz.consents.map( consent =>{
                                if(consent.actived)
                                    return <Consent
                                        key={consent.id}
                                        id={consent.id}
                                        quizState={quizState}
                                        quizDispatch={quizDispatch}
                                    />
                                return <></>
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    );
}

Quiz.propTypes={}

export default Quiz;