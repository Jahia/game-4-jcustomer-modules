import React from 'react';
import PropTypes from "prop-types";
import {StoreContext} from "contexts";
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSONALIZED_RESULT} from "./PersonalizedGraphQL";
import get from "lodash.get";
import DOMPurify from "dompurify";
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    result:{
        marginTop: `${theme.spacing(8)}px`,
    }
}));

const Personalized = (props) => {
    const {id,cxs}=props;
    const classes = useStyles(props);
    const { state } = React.useContext(StoreContext);
    const { jContent } = state;

    const [result, setResult] = React.useState({});

    const {loading, error, data} = useQuery(GET_PERSONALIZED_RESULT, {
        variables:Object.assign(jContent.gql_variables,{
            profileId:cxs.profileId,
            sessionId:cxs.sessionId,
            id
        }),
        fetchPolicy: "no-cache"
    });

    React.useEffect(() => {
        if(loading === false && data){
            const persoData = get(data, "response.result.jExperience.variant", {});
            setResult({
                ...persoData,
                text:persoData.text.value
            });
        }
    }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.debug("*** paint personalized result : ",result.title);

    // console.log("Personalized props.show :",props.show);

    return(
        <Typography className={classes.result}
                    component="div"
                    dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(result.text, { ADD_ATTR: ['target'] })}}/>
    );

    // return(
    //     <div className="game4-quiz__score-result col-6 offset-3 col-md-4 offset-md-4 mb-5"
    //          dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(result.text, { ADD_ATTR: ['target'] })}}>
    //     </div>
    // );
}

Personalized.propTypes={
    id:PropTypes.string.isRequired,
    cxs:PropTypes.object.isRequired
}

export default Personalized;