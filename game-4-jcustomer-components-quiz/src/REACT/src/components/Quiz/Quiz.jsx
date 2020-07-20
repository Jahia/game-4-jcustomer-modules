import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Consent from "components/Consent";
import uTracker from "unomi-analytics";

const Quiz = (props) => {
    const {files_endpoint,consent_status,scope} =  React.useContext(JContext);
    //used for consent approval; list of consentID checked
    //I use an array structure in case I want to use multiple consent in future
    const [checked, setChecked] = React.useState({});
    const [granted, setGranted] = React.useState([]);
    const [disabledStartBtn, setDisabledStartBtn] = React.useState(!props.showNext);

    React.useEffect(() => {
        // console.log("*** Quiz checked OR granted useEffect : !props.showNext : ",!props.showNext);
        //if nothing to show after return immediately
        if(!props.showNext)
            return;

        let allConsentChecked = false;
        console.log(" ** granted  : ",granted);

        if(props.quiz.consents){
            // console.log("*** granted :",granted);
            const checkedConsentIds = Object.keys(checked);
            const consentIds2Check = [...granted,...checkedConsentIds];
            const activedConsentIds = props.quiz.consents
                .filter(consent => consent.actived)
                .map(consent => consent.id);
            const results = consentIds2Check.filter(consentId => activedConsentIds.includes(consentId));
            allConsentChecked = results.length === activedConsentIds.length;
        }
        // console.log("*** allConsentChecked :",allConsentChecked);

        setDisabledStartBtn(!allConsentChecked);

    }, [checked,granted]);

    const handleChange= (e) => {
        // console.log("handleChange  target.id : ",e.target.id,"; target.name : ",e.target.name);

        //case checkbox
        const index = Object.keys(checked).indexOf(e.target.id);

        if(index === -1){//checked
            setChecked({...checked, [e.target.id]:e.target.name } );

        }else{//unchecked
            delete checked[e.target.id]
            setChecked({...checked});
        }
    }

    const onCLick = (e) => {
        Object.keys(checked).forEach(consentId => {
            handleConsentStatus(checked[consentId],consent_status.GRANTED);
        });
        props.onClickNext();
    };

    const handleConsentStatus = (typeIdentifier,status) => {
        const statusDate = new Date();
        const revokeDate = new Date(statusDate);
        revokeDate.setFullYear(revokeDate.getFullYear()+2);
        console.log("handleConsentStatus status :",status);


            uTracker.track("modifyConsent",{
                consent: {
                    typeIdentifier,
                    scope,
                    status,
                    statusDate: statusDate.toISOString(),//"2018-05-22T09:27:09.473Z",
                    revokeDate: revokeDate.toISOString()//"2020-05-21T09:27:09.473Z"
                }
            });

    }
    // console.log("quiz do ");
    return(
        <div className={`game4-quiz__item show-overlay ${props.show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${encodeURI(props.quiz.cover)}`}
                 alt={props.quiz.title}/>
            <div className="game4-quiz__caption">
                <h2 className="text-uppercase">{props.quiz.title}
                    <span className="subtitle">{props.quiz.subtitle}</span>
                </h2>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {props.quiz.duration}
                </div>

                <div className="lead" dangerouslySetInnerHTML={{__html:props.quiz.description}}></div>

                <Button variant="game4-quiz"
                        onClick={onCLick}
                        disabled={disabledStartBtn}>
                    Commencer
                </Button>
            </div>
            {
                props.quiz.consents.length > 0 && props.cxs &&
                <div className="game4-quiz__consent">
                    <h5>consentement</h5>
                    <ul>
                        {
                            props.quiz.consents.map( consent =>{
                                if(consent.actived)
                                    return <Consent
                                        key={consent.id}
                                        id={consent.id}
                                        checked={Object.keys(checked).includes(consent.id)}
                                        setChecked={setChecked}
                                        handleChange={handleChange}
                                        cxs={props.cxs}
                                        setGranted={setGranted}
                                        granted={granted}
                                        handleConsentStatus={handleConsentStatus}
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

Quiz.propTypes={
    quiz:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    showNext:PropTypes.bool.isRequired,
    cxs:PropTypes.object
}

export default Quiz;