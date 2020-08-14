import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import {StoreContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Consent from "components/Consent";
import get from "lodash.get";

import {syncConsentStatus} from "misc/tracker";

const init = variables =>{
    return {
        ...variables,
        consents:[]//list of consent
    }
}

const computeEnableStartBtn = (state) => {
    const {showNext,workspace,consents} = state;

    if(showNext && workspace !== "LIVE")
        return true;

    const granted = consents.filter( consent => consent.checked || consent.granted );
    return consents.length === granted.length;
}


function reducer(state, action) {
    const { payload } = action;

    switch (action.case) {
        case "DATA_READY_CONSENT":{
            let {consents} = state;
            const {consentData,scope,cxs,consent_status} = payload;
            console.debug("[QUIZ] DATA_READY_CONSENT -> consentData :",consentData);

            const identifier = get(consentData, "identifier");

            //compute granted
            const consentPath = `consents["${scope}/${identifier}"]`;
            const cxsConsentStatus = get(cxs,`${consentPath}.status`);
            const cxsConsentRevokeDate = get(cxs,`${consentPath}.revokeDate`);
            const granted = consent_status.GRANTED === cxsConsentStatus
                && Date.now() < Date.parse(cxsConsentRevokeDate)

            consents = [...consents,{
                id : get(consentData, "id"),
                title : get(consentData, "title"),
                description : get(consentData, "description.value"),
                actived : JSON.parse(get(consentData, "actived.value", false)),
                checked : false,
                identifier,
                granted
            }];

            return{
                ...state,
                consents,
                enableStartBtn:computeEnableStartBtn({...state,consents})
            }
        }
        case "DENIED_CONSENT":{
            const {consents} = state;
            const {id} = payload;
            console.debug("[QUIZ] DENIED_CONSENT -> id :",id);

            return{
                ...state,
                consents:consents.map( consent => {
                    if( consent.id === id)
                        return {
                            ...consent,
                            granted:false
                        };
                    return consent
                }),
                enableStartBtn:false
            }
        }
        case "TOGGLE_CONSENT": {
            let {consents} = state;
            const {id} = payload;
            console.debug("[QUIZ] TOGGLE_CONSENT -> id :",id);

            consents = consents.map(consent => {
                if(consent.id === id)
                    return {
                        ...consent,
                        checked:!consent.checked
                    };
                return consent
            });

            return{
                ...state,
                consents,
                enableStartBtn:computeEnableStartBtn({...state,consents})
            }
        }
        default:
            throw new Error(`[QUIZ] action case '${action.case}' is unknown `);
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

    console.debug("*** paint quiz : ",quiz.title);
    const show = currentSlide === quiz.id;

    const onClick = () => {
        quizState.consents.forEach(consent=>{
            //already granted nothing to do
            if(consent.granted)
                return;

            syncConsentStatus({
                scope,
                typeIdentifier:consent.identifier,
                status:consent_status.GRANTED
            });
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