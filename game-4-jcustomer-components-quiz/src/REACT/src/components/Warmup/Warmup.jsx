import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";
import {GET_WARMUP} from "./WarmupGraphQL";
import VideoPlayer from "components/VideoPlayer";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useQuery} from "@apollo/react-hooks";
import Qna from "components/Qna";
// import {getRandomString} from "misc/utils";
// import { loader } from 'graphql.macro';


class _Warmup{
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    constructor(warmupData,files_endpoint) {
        // console.log("Warmup : ",quiz);
        this.id= get(warmupData, "id", "");
        this.title= get(warmupData, "title", "");
        this.subtitle= get(warmupData, "subtitle.value", "");
        this.content= get(warmupData, "content.value", "");
        this.duration= get(warmupData, "duration.value", "");
        this.videoLink= get(warmupData, "videoLink.value", "");
        this.videoIntPath = get(warmupData, "videoIntPath.node.path");

        this.cover= get(warmupData, "cover.node.path", "");
        this.childNodes=
            get(warmupData,"children.nodes",[])
            .map(node => {
                return{
                    id: get(node, "id"),
                    type: get(node, "type.value")
                }
            });

        if(this.videoLink)
            this.video= this.videoIntPath ?
                `${files_endpoint}${encodeURI(this.videoIntPath)}`:
                get(warmupData, "videoExtPath.value")
    };
};

const Warmup = (props) => {
    const {gql_variables,files_endpoint,language_bundle} =  useContext(JContext);
    const variables = Object.assign(gql_variables,{id:props.id})
    // const query = loader("./Warmup.graphql.disabled");
    const {loading, error, data} = useQuery(GET_WARMUP, {
        variables:variables,
    });

    const [warmup, setWarmup] = React.useState({childNodes:[]});

    // const {addItem2Slides} = props;
    React.useEffect(() => {

        if(loading === false && data){

            const warmup=new _Warmup(get(data, "response.warmup", {}),files_endpoint);
            // console.log("Warmup ",warmup.id," : init");

            const nodesIds = [];
            warmup.childNodes.forEach(node => nodesIds.push(node.id));
            props.addItem2Slides(nodesIds,warmup.id);

            // console.debug("warmup.id : ",warmup.id,"; warmup.video : ",warmup.video);
            setWarmup(warmup);
        }
    },[loading,data]);

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
                    <Button variant="game4-quiz"
                            onClick={props.onClickNext}>
                        {/*disabled={!props.showNext}*/}
                        {language_bundle && language_bundle.btnQuestion}
                    </Button>
                </div>
            </div>
            {warmup.childNodes.map( node =>
                <Qna
                    key={node.id}
                    id={node.id}
                    show={props.index === node.id}
                    // quizKey={props.quizKey}
                    resultSet={props.resultSet}
                    setResultSet={props.setResultSet}
                />
            )}
        </>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    // quizKey:PropTypes.string.isRequired,
    resultSet:PropTypes.array.isRequired,
    setResultSet:PropTypes.func.isRequired,
    addItem2Slides:PropTypes.func.isRequired,
    index:PropTypes.string.isRequired,
    onClickNext:PropTypes.func.isRequired
}

export default Warmup;