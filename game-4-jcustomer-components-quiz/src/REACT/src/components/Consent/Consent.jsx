import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";

import {useQuery} from "@apollo/react-hooks";
import {GET_CONSENT} from "components/Consent/ConsentGraphQL";
import get from "lodash.get";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {syncConsentStatus} from "misc/tracker";
import {StoreContext} from "contexts";

const Consent = (props)=> {
    const {id, quizState, quizDispatch} = props;
    const [consent={}] = quizState.consents.filter(consent => consent.id === id);

    const { state } = React.useContext(StoreContext);

    const {jContent,cxs} = state;
    const {gql_variables,scope,consent_status} =  jContent;

    const variables = Object.assign(gql_variables,{id})
    const {loading, error, data} = useQuery(GET_CONSENT, {
        variables:variables,
    });

    React.useEffect(() => {

        if(loading === false && data){
            const consentData = get(data, "response.consent", {});
            quizDispatch({
                case:"DATA_READY_CONSENT",
                payload:{
                    consentData,
                    scope,
                    cxs,
                    consent_status
                }
            })
        }

    }, [loading,data]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // console.debug("*** paint consent : ",id);

    const handleDenied = (consent) => {
        syncConsentStatus({
            scope,
            typeIdentifier:consent.identifier,
            status:consent_status.DENIED
        });

        quizDispatch({
            case:"DENIED_CONSENT",
            payload:{
                id:consent.id
            }
        });
    }

    const handleChange= (e) => {
        quizDispatch({
            case:"TOGGLE_CONSENT",
            payload:{
                id:e.target.id
            }
        });
    }

    return(
        <li>
            {!consent.granted &&
                <div className="consent-to-grant">
                    <Form.Check
                        custom
                        type="checkbox"
                        name={consent.identifier}
                        id={consent.id}
                        label={consent.title}
                        onChange={handleChange}
                        checked={consent.checked}
                    />
                    <i>{consent.description}</i>
                </div>
            }
            {consent.granted &&
                <p className="consent-granted">
                    <FontAwesomeIcon icon={['fas','check']}/>
                    {consent.title}
                    <FontAwesomeIcon className="consent-denied" icon={['fas','ban']} onClick={()=> handleDenied(consent)}/>
                    <i>{consent.description}</i>
                </p>
            }
        </li>
    )
}

Consent.propTypes={
    id:PropTypes.string.isRequired,
    quizState:PropTypes.object.isRequired,
    quizDispatch:PropTypes.func.isRequired
};

export default Consent;