import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Col, Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";
import {GET_WARMUP} from "./WarmupGraphQL";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useQuery} from "@apollo/react-hooks";
// import { loader } from 'graphql.macro';

const Warmup = ({id,show,quizKey}) => {
    const {gql_variables,files_endpoint} =  useContext(JContext);
    const variables = Object.assign(gql_variables,{id:id})

    // const query = loader("./Warmup.graphql.disabled");
    const {loading, error, data} = useQuery(GET_WARMUP, {
        variables:variables,
    });
    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const warmupData = get(data, "response.warmup", {});
    
    const warmup = {
        title: get(warmupData, "title", ""),
        subtitle: get(warmupData, "subtitle.value", ""),
        content: get(warmupData, "content.value", ""),
        duration: get(warmupData, "duration.value", ""),
        videoLink: get(warmupData, "videoLink.value", ""),
        videoExtPath: get(warmupData, "videoExtPath.value"),
        videoIntPath: get(warmupData, "videoIntPath.node.path"),
        cover: get(warmupData, "cover.node.path", ""),
        childNodes : get(warmupData,"children.nodes",[])
    };

    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            <img className="d-block w-100"
                 src={`${files_endpoint}${warmup.cover}`}
                 alt={warmup.title}/>
            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{warmup.title}<span className="subtitle">{warmup.subtitle}</span></h2>
                <div className="lead" dangerouslySetInnerHTML={{__html:warmup.content}}></div>
            </div>
        </div>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    quizKey:PropTypes.string.isRequired
}

export default Warmup;