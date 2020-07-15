import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Consent from "components/Consent";
import uTracker from "unomi-analytics";

const Quiz = (props) => {
    const {files_endpoint,consent_status} =  React.useContext(JContext);
    //used for consent approval; list of consentID checked
    //I use an array structure in case I want to use multiple consent in future
    const [checked, setChecked] = React.useState([]);

    const handleChange= (e) => {
        console.log("handleChange : ",e.target.id);

        //case checkbox
        const index = checked.indexOf(e.target.id);
        if(index === -1){//checked
            setChecked([...checked, e.target.id]);
        }else{//unchecked
            checked.splice(index,1);
            setChecked([...checked]);
        }
    }

    const onCLick = (e) => {
        //TODO call consent et definir une onCLick qui envoie l'update du consent + execute props.onCLickNext()
        uTracker.track("modifyConsent",{
            consent: {
                typeIdentifier: "newsletter", //TODO getConsentId
                scope: "example",//TODO getScope
                status: consent_status.GRANTED,//TODO use context
                statusDate: "2018-05-22T09:27:09.473Z",//TODO Date.now()
                revokeDate: "2020-05-21T09:27:09.473Z"//TODO Date.now()+ 2ans
            }
        });

        props.onClickNext();
    }


    return(
        <div className={`game4-quiz__item show-overlay ${props.show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${encodeURI(props.quiz.cover)}`}
                 alt={props.quiz.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{props.quiz.title}<span className="subtitle">{props.quiz.subtitle}</span></h2>
                <div className="lead" dangerouslySetInnerHTML={{__html:props.quiz.description}}></div>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {props.quiz.duration}
                </div>

                <Button variant="game4-quiz"
                        onClick={props.onClickNext}
                        disabled={!props.showNext}>
                    Commencer
                </Button>


                {props.quiz.consent &&
                    <Consent
                        id={props.quiz.consent}
                        checked={checked.includes(props.quiz.consent)}
                        setChecked={setChecked}
                        handleChange={handleChange}
                    />
                }

            </div>
        </div>
    );
}

Quiz.propTypes={
    quiz:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    onClickNext:PropTypes.func.isRequired,
    showNext:PropTypes.bool.isRequired
}

export default Quiz;