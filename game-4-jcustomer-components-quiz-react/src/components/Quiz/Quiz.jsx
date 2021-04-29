import React from 'react';
// import PropTypes from "prop-types";

import {Button,Typography} from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {makeStyles} from "@material-ui/core/styles";

import {StoreContext} from "contexts";
import Consent from "components/Consent";
import get from "lodash.get";

import {syncConsentStatus} from "misc/tracker";
import Media from '../Media'
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import DOMPurify from "dompurify";
import Header from "components/Header/Header";

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
        // position: 'absolute',
        // bottom: '.5rem',
        // '--percentage':`calc(100% - ${theme.geometry.caption.width})`,
        // right: 'calc(var(--percentage) / 2)',
        // left: 'calc(var(--percentage) / 2)',
        // paddingRight:theme.geometry.caption.padding,
        // paddingLeft:theme.geometry.caption.padding,
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

const Quiz = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const { state, dispatch } = React.useContext(StoreContext);

    const {quiz,showNext,currentSlide,jContent,cxs} = state;
    const {consent_status,scope,gql_variables,language_bundle} = jContent;

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
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            <Header/>
            {quiz.media &&
            <Media id={quiz.media.id}
                   type={quiz.media.type.value}
                   mixins={quiz.media.mixins.map(mixin=>mixin.value)}
                   path={quiz.media.path}
                   alt={quiz.title}
            />
            }


            <div className={sharedClasses.caption}>
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

                <Button onClick={onClick}
                        disabled={!quizState.enableStartBtn}>
                    {language_bundle && language_bundle.btnStart}
                </Button>
            </div>
            {
                quiz.consents.length > 0 && cxs &&
                <div className={classes.consent}>
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
        </div>
    );


    // return(
    //     <div className={classnames(
    //         sharedClasses.item,
    //         sharedClasses.showOverlay,
    //         (show ? 'active':'')
    //     )}>
    //         {quiz.media &&
    //         <Media id={quiz.media.id}
    //                type={quiz.media.type.value}
    //                mixins={quiz.media.mixins.map(mixin=>mixin.value)}
    //                path={quiz.media.path}
    //                alt={quiz.title}
    //         />
    //         }
    //
    //         <div className={sharedClasses.caption}>
    //             <Typography className={sharedClasses.textUppercase}
    //                         variant="h3">
    //                 {quiz.title}
    //             </Typography>
    //             <Typography className={sharedClasses.subtitle}
    //                         color="primary"
    //                         variant="h4">
    //                 {quiz.subtitle}
    //             </Typography>
    //
    //             <Typography component="div"
    //                         className={classes.duration}>
    //                 <AccessTimeIcon />
    //                 {quiz.duration}
    //             </Typography>
    //
    //             <Typography component="div"
    //                         className={classes.description}
    //                         dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(quiz.description, { ADD_ATTR: ['target'] })}}/>
    //
    //             <Button onClick={onClick}
    //                     disabled={!quizState.enableStartBtn}>
    //                 {language_bundle && language_bundle.btnStart}
    //             </Button>
    //         </div>
    //         {
    //             quiz.consents.length > 0 && cxs &&
    //             <div className={classes.consent}>
    //                 <Typography className={classes.consentTitle}
    //                             variant="h5">
    //                     {language_bundle && language_bundle.consentTitle}
    //                 </Typography>
    //                 <ul>
    //                     {
    //                         quiz.consents.map( consent =>{
    //                             if(consent.actived)
    //                                 return <Consent
    //                                     key={consent.id}
    //                                     id={consent.id}
    //                                     quizState={quizState}
    //                                     quizDispatch={quizDispatch}
    //                                 />
    //                             return <></>
    //                         })
    //                     }
    //                 </ul>
    //             </div>
    //         }
    //     </div>
    // );

}

// Quiz.propTypes={}

export default Quiz;