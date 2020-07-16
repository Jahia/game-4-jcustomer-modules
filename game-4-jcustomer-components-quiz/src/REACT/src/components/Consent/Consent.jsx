import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {JContext} from "contexts";
import {useQuery} from "@apollo/react-hooks";
import {GET_CONSENT} from "components/Consent/ConsentGraphQL";
import get from "lodash.get";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class _Consent{
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    constructor(consentData) {
        this.id= get(consentData, "id");
        this.identifier= get(consentData, "identifier");
        this.title= get(consentData, "title");
        this.description= get(consentData, "description.value");
        this.actived= JSON.parse(get(consentData, "actived.value", false));
    };
}

const Consent = (props)=> {
    const {gql_variables,scope,consent_status} =  React.useContext(JContext);
    const variables = Object.assign(gql_variables,{id:props.id})
    const {loading, error, data} = useQuery(GET_CONSENT, {
        variables:variables,
    });

    const [consent, setConsent] = React.useState({});
    const [consentGranted, setConsentGranted] = React.useState(false);
    // const [checked, setChecked] = React.useState([]);

    React.useEffect(() => {

        if(loading === false && data){
            const consentData = get(data, "response.consent", {});
            // console.log("Consent ",consentData.id," : init");
            setConsent(new _Consent(consentData));
        }

    }, [loading,data]);

    React.useEffect(() => {
        //get consent value and check if it was approuved
        //TODO verifier si workspace = LIVE et [si window.cxs sinon faire un setTimout? ou faire un status sur cxs loaded !]
        const consentPath = `consents["${scope}/${consent.identifier}"].status`;
        const cxsConsentStatus = get(props.cxs,consentPath);

        console.log("consent_status.GRANTED : ",consent_status.GRANTED);
        if(consent_status.GRANTED === cxsConsentStatus){
            setConsentGranted(true);
            props.setGranted([...props.granted,consent.id]);
        }
        console.log("useEffect props.cxs",props.cxs);
    },[consent,props.cxs]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log("consent do");
    return(
        <li>
            {consent.actived && !consentGranted &&
                <div className="consent-to-grant">
                    <Form.Check
                        custom
                        type="checkbox"
                        name={consent.identifier}
                        id={consent.id}
                        label={consent.title}
                        onChange={props.handleChange}
                        checked={props.checked}
                    />
                    <i>{consent.description}</i>
                </div>
            }
            {consent.actived && consentGranted &&
                <p className="consent-granted">
                    <FontAwesomeIcon icon={['fas','check']}/>
                    {consent.title}
                </p>
            }
        </li>
    )
}

Consent.propTypes={
    id:PropTypes.string.isRequired,
    checked:PropTypes.bool.isRequired,
    setChecked:PropTypes.func.isRequired,
    handleChange:PropTypes.func.isRequired,
    cxs:PropTypes.object.isRequired,
    setGranted:PropTypes.func.isRequired,
    granted:PropTypes.array.isRequired
};

export default Consent;