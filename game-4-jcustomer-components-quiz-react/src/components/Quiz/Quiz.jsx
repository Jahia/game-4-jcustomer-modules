import React from 'react';
// import PropTypes from "prop-types";

import {Button,Typography} from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {makeStyles} from "@material-ui/core/styles";

import {StoreContext} from "contexts";
import Consent from "components/Consent";
import get from "lodash.get";

import {syncConsentStatus} from "misc/wemAPI";
import Media from '../Media'
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import DOMPurify from "dompurify";
import Header from "components/Header/Header";
import {manageTransition} from "misc/utils";
import useMarketo from "components/Marketo/LoadScript";
// import {mktgForm} from "douane/lib/config";

const useStyles = makeStyles(theme => ({
    duration:{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        '& svg': {
            marginRight: '3px',
        },
        marginTop:`${theme.spacing(3)}px`,
    },
    description:{
        // textAlign: 'left',
        maxWidth:'500px',
        margin:`${theme.spacing(4)}px auto`,

    },
    consent:{
        width:'100%',
        paddingRight:`${theme.spacing(4)}px`,
        paddingLeft:`${theme.spacing(4)}px`,
        zIndex: 10,
        "& ul":{
            listStyle: 'none',
            padding:0,
        },
        "& li":{
            marginBottom: '.5rem'
        }
    },
    consentTitle:{
        textTransform:'capitalize',
        textDecoration:'underline'
    },
    wemError:{
        backgroundColor:theme.palette.error.dark,
        borderRadius:'3px',
        display: 'inline',
        padding: '5px 10px'
    }
}));

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
            const {consentData,scope,wem,consent_status} = payload;
            console.debug("[QUIZ] DATA_READY_CONSENT -> consentData :",consentData);

            const identifier = get(consentData, "identifier");

            //compute granted
            const consentPath = `consents["${scope}/${identifier}"]`;

            //TODO verifier la structure, je ne pense pas avoir le context ici
            const cxsConsentStatus = get(wem,`${consentPath}.status`);
            const cxsConsentRevokeDate = get(wem,`${consentPath}.revokeDate`);

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

const MktoForm = (props) => {

    // const { baseUrl, munchkinId, formId } = props;
    const { formId } = props;
    useMarketo(props);
    return <form id={`mktoForm_${formId}`} />;
}

const Quiz = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const { state, dispatch } = React.useContext(StoreContext);

    const {
        quiz,
        showNext,
        currentSlide,
        jContent,
        wem
    } = state;

    const {
        consent_status,
        scope,
        gql_variables,
        language_bundle,
        mktgForm
    } = jContent;

    const enableStartBtn = showNext &&
        // !quiz.mktoForm &&
        quiz.consents.length > 0? gql_variables.workspace !== "LIVE" : true;

    const [quizState, quizDispatch] = React.useReducer(
        reducer,
        {
            enableStartBtn,//: showNext && gql_variables.workspace !== "LIVE",
            workspace:gql_variables.workspace,
            showNext,
        },
        init
    );

    console.debug("*** paint quiz : ",quiz.title);
    const show = currentSlide === quiz.id;

    const onClick = () => {
        const consents = quizState
                            .consents
                            .filter(consent => !consent.granted)
                            .map(consent => {
                                return {
                                    scope,
                                    typeIdentifier:consent.identifier,
                                    status:consent_status.GRANTED
                                }
                        })
        syncConsentStatus({wem,consents})
        // quizState.consents.forEach(consent=>{
        //     //already granted nothing to do
        //     if(consent.granted)
        //         return;
        //
        //     syncConsentStatus({
        //         scope,
        //         typeIdentifier:consent.identifier,
        //         status:consent_status.GRANTED
        //     });
        // })

        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });

    };
    const handleMktoFormSuccess = (values,targetPageUrl) =>{
        console.debug("[handleMktoFormSuccess] values : ",values);
        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });
        return false;
    }

    const handleMktoForm = (form) =>{
        form.addHiddenFields({
            'pageURL' : document.location.href,
            'cxsProfileId' : wem?wem.profileId:'',
        });
        form.onSuccess(handleMktoFormSuccess);
    }

    const getStartComponent = () => {

        const _wem = window.wem || false;
        if(!state.wem &&
            _wem.constructor === Object &&
            Object.keys(_wem).length === 0)
            return <Typography className={classes.wemError}
                               variant="h5">
                Internal jExperience connection issue
            </Typography>

        if(!quiz.mktgForm)
            return <Button onClick={onClick}
                           disabled={!quizState.enableStartBtn}>
                {language_bundle && language_bundle.btnStart}
            </Button>

        if(quiz.mktgForm === mktgForm.MARKETO && quiz.mktoConfig && wem)
            return <MktoForm
                baseUrl={quiz.mktoConfig.baseUrl}
                munchkinId={quiz.mktoConfig.munchkinId}
                formId={quiz.mktoConfig.formId}
                whenReadyCallback={handleMktoForm}
            />
    }

    const getConsent = () =>{
        if(quiz.mktgForm)
            return;
        if(quiz.consents.length > 0 && wem)
            return <div className={classes.consent}>
                        <Typography className={classes.consentTitle}
                                    variant="h5">
                            {language_bundle && language_bundle.consentTitle}
                        </Typography>
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

    return(
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            <Header/>
            {quiz.media &&
            <Media id={quiz.media.id}
                   type={quiz.media.type?quiz.media.type.value:null}
                   mixins={quiz.media.mixins?quiz.media.mixins.map(mixin=>mixin.value):[]}
                   path={quiz.media.path}
                   alt={quiz.title}
            />
            }


            <div className={classnames(
                sharedClasses.caption,
                sharedClasses.captionMain
            )}>
                <Typography className={sharedClasses.textUppercase}
                            variant="h3">
                    {quiz.title}
                </Typography>
                <Typography className={sharedClasses.subtitle}
                            color="primary"
                            variant="h4">
                    {quiz.subtitle}
                </Typography>

                <Typography component="div"
                            className={classes.duration}>
                    <AccessTimeIcon />
                    {quiz.duration}
                </Typography>

                <Typography component="div"
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(quiz.description, { ADD_ATTR: ['target'] })}}/>

                {getStartComponent()}
            </div>
            {getConsent()}
        </div>
    );
}

// Quiz.propTypes={}

export default Quiz;