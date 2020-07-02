import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Col, Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";
import {GET_WARMUP} from "./WarmupGraphQL";
import VideoPlayer from "components/VideoPlayer";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useQuery} from "@apollo/react-hooks";
import QuizChild from "components/QuizChild";
import Qna from "components/Qna";
// import { loader } from 'graphql.macro';

const Warmup = (props) => {
    const {gql_variables,files_endpoint} =  useContext(JContext);
    const variables = Object.assign(gql_variables,{id:props.id})
    // const query = loader("./Warmup.graphql.disabled");
    const {loading, error, data} = useQuery(GET_WARMUP, {
        variables:variables,
    });

    const [warmup, setWarmup] = React.useState({childNodes:[]});
    React.useEffect(() => {

        if(loading === false && data){
            const childNodesIds = [];
            const warmupData = get(data, "response.warmup", {});
            console.log("Warmup ",warmupData.id," : init");

            const warmup = {
                id: get(warmupData, "id", ""),
                title: get(warmupData, "title", ""),
                subtitle: get(warmupData, "subtitle.value", ""),
                content: get(warmupData, "content.value", ""),
                duration: get(warmupData, "duration.value", ""),
                videoLink: get(warmupData, "videoLink.value", ""),
                cover: get(warmupData, "cover.node.path", ""),
                childNodes: get(warmupData,"children.nodes",[]).map(node =>{
                    const nodeId = get(node, "id");
                    childNodesIds.push(nodeId);
                    return {
                        id: nodeId,
                        type: get(node, "type.value")
                    };
                })
            };
            props.addItem2Slides(childNodesIds,warmup.id);

            if(warmup.videoLink){
                const videoIntPath = get(warmupData, "videoIntPath.node.path");
                warmup.video= videoIntPath ?
                    `${files_endpoint}${encodeURI(videoIntPath)}`:
                    get(warmupData, "videoExtPath.value")
            }

            // console.log("warmup.id : ",warmup.id);
            // console.log("warmup.video : ",warmup.video);
            setWarmup(warmup);
        }
    },[loading,data]);

    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    // console.log("warmup.video global : ",warmup.video);

    return(
        <>
            <div className={`game4-quiz__item show-overlay ${props.show ? 'active':''} `}>
                <img className="d-block w-100"
                     src={`${files_endpoint}${warmup.cover}`}
                     alt={warmup.title}/>

                <div className="game4-quiz__caption d-none d-md-block">
                    <h2 className="text-uppercase">{warmup.title}<span className="subtitle">{warmup.subtitle}</span></h2>
                    <div className="lead" dangerouslySetInnerHTML={{__html:warmup.content}}></div>
                    { warmup.video != null &&
                        <div>
                            <VideoPlayer
                                videoURL={warmup.video}
                                warmupID={warmup.id}
                            />
                        </div>
                    }
                </div>
            </div>
            {warmup.childNodes.map( node =>
                <Qna
                    key={node.id}
                    id={node.id}
                    show={props.index === node.id}
                    quizKey={props.quizKey}
                    setShowResult={props.setShowResult}
                    setResult={props.setResult}
                />
            )}
        </>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    quizKey:PropTypes.string.isRequired,
    setShowResult:PropTypes.func.isRequired,
    setResult:PropTypes.func.isRequired,
    addItem2Slides:PropTypes.func.isRequired,
    index:PropTypes.string.isRequired
}

export default Warmup;