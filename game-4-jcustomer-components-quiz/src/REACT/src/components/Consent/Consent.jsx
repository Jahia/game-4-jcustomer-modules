import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";

import {useQuery} from "@apollo/react-hooks";
import {GET_CONSENT} from "components/Consent/ConsentGraphQL";
import get from "lodash.get";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import uTracker from "unomi-analytics";
import {StoreContext} from "contexts";


class _Consent{
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    constructor(consentData) {
        this.id= get(consentData, "id");
        this.identifier= get(consentData, "identifier");
        this.title= get(consentData, "title");
        this.description= get(consentData, "description.value");
        this.actived= JSON.parse(get(consentData, "actived.value", false));
        this.checked=false;
        this.granted=false;
    };

    toggleChecked(){
        this.checked = !this.checked;
    }

    syncStatus({scope,status}) {
        const statusDate = new Date();
        const revokeDate = new Date(statusDate);
        revokeDate.setFullYear(revokeDate.getFullYear() + 2);
        console.debug("consent.syncStatus status :", status);

        uTracker.track("modifyConsent", {
            consent: {
                typeIdentifier: this.identifier,
                scope,
                status,
                statusDate: statusDate.toISOString(),//"2018-05-22T09:27:09.473Z",
                revokeDate: revokeDate.toISOString()//"2020-05-21T09:27:09.473Z"
            }
        });
    };

    isGranted({scope,cxs,consent_status}){
        const consentPath = `consents["${scope}/${this.identifier}"]`;

        const consentPathStatus= `${consentPath}.status`;
        const consentPathRevokeDate=`${consentPath}.revokeDate`;

        const cxsConsentStatus = get(cxs,consentPathStatus);
        const cxsConsentRevokeDate = get(cxs,consentPathRevokeDate);

        // console.log("consent : ",consentPath," : ",consent_status.GRANTED);
        // console.log("cxsConsentRevokeDate : ",cxsConsentRevokeDate);

        // console.log("Date.parse(cxsConsentRevokeDate) : ",Date.parse(cxsConsentRevokeDate));
        // console.log("Date.now() : ",Date.now());
        if(consent_status.GRANTED === cxsConsentStatus
            && Date.now() < Date.parse(cxsConsentRevokeDate) )
            this.granted=true;
    }

}

const Consent = (props)=> {
    const { quizDispatch } = props;
    const { state } = React.useContext(StoreContext);

    const {jContent,cxs} = state;
    const {gql_variables,scope,consent_status} =  jContent;

    const variables = Object.assign(gql_variables,{id:props.id})
    const {loading, error, data} = useQuery(GET_CONSENT, {
        variables:variables,
    });

    const [consent, setConsent] = React.useState({});

    React.useEffect(() => {

        if(loading === false && data){
            const consentData = get(data, "response.consent", {});
            // console.log("Consent ",consentData.id," : init");
            const consent = new _Consent(consentData,cxs);

            if(!consent.actived)
                return;

            consent.isGranted({scope,cxs,consent_status})
            quizDispatch({
                case:"ADD_CONSENT",
                payload:{
                    consent
                }
            })
            setConsent(consent);
        }

    }, [loading,data]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleDenied = () => {
        consent.syncStatus({scope,status:consent_status.DENIED});

        setConsent(consent =>{
            consent.granted=false;

            quizDispatch({
                case:"DENIED_CONSENT",
                payload:{
                    consent
                }
            })

            return consent;
        })
    }

    const handleChange= () => {

        setConsent(consent =>{
            consent.toggleChecked();

            quizDispatch({
                case:"TOGGLE_CONSENT",
                payload:{
                    consent
                }
            })

            return consent;
        })
    }

    // console.log("consent do");
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
                    <FontAwesomeIcon className="consent-denied" icon={['fas','ban']} onClick={handleDenied}/>
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