import React from 'react';
import PropTypes from "prop-types";

import {useQuery} from "@apollo/react-hooks";
import {GET_CONSENT} from "components/Consent/ConsentGraphQL";
import get from "lodash.get";

import {syncConsentStatus} from "misc/wemAPI";
import {StoreContext} from "contexts";
import {makeStyles} from "@material-ui/core/styles";
import CheckIcon from '@material-ui/icons/Check';
import BackspaceIcon from '@material-ui/icons/Backspace';
import {Typography,FormGroup,FormControlLabel,Checkbox} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    granted:{
        display:"flex",
        flexWrap:"wrap",
        alignItems: 'center',
        margin:0,
        "& svg":{
            marginRight: '.5rem',
        },
        "& i":{
            flexBasis: '100%',
            fontSize: '.85rem',
        }
    },
    denied:{
        cursor: 'pointer',
        color: theme.palette.error.main,
        width: '1rem',
        marginLeft:'.5rem',
    }
}));

const Consent = (props)=> {
    const classes = useStyles(props);

    const {id, quizState, quizDispatch} = props;
    const [consent={}] = quizState.consents.filter(consent => consent.id === id);

    const { state } = React.useContext(StoreContext);

    const {jContent,wem} = state;
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
                    wem,
                    consent_status
                }
            })
        }

    }, [loading,data]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.debug("*** paint consent : ",id);

    const handleDenied = (consent) => {
        syncConsentStatus(wem,[{
            scope,
            typeIdentifier:consent.identifier,
            status:consent_status.DENIED
        }]);

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
            <div>
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value={consent.checked}
                        control={<Checkbox id={consent.id} />}
                        label={consent.title}
                        labelPlacement="end"
                        onChange={handleChange}
                    />
                </FormGroup>
                <Typography className={classes.granted}
                            style={{fontSize: '.85rem'}}
                            component="i">
                    {consent.description}
                </Typography>
            </div>
            }
            {consent.granted &&
                <Typography className={classes.granted}
                            component="p">
                    <CheckIcon />
                    {consent.title}
                    <BackspaceIcon className={classes.denied}
                                   onClick={()=> handleDenied(consent)} />
                    <i>{consent.description}</i>
                </Typography>
            }
        </li>
    )
};

Consent.propTypes={
    id:PropTypes.string.isRequired,
    quizState:PropTypes.object.isRequired,
    quizDispatch:PropTypes.func.isRequired
};

export default Consent;