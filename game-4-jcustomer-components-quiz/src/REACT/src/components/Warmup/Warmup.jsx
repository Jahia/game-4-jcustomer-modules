import React, {useContext} from 'react';
import PropTypes from "prop-types";
import {Col, Button} from "react-bootstrap";

import get from "lodash.get";
import {JContext} from "contexts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useQuery} from "@apollo/react-hooks";
import { loader } from 'graphql.macro';

const Warmup = ({id,show,childIndex,setChildIndex,max,getFinalScore,quizKey}) => {
    const {gql_variables} =  useContext(JContext);
    const variables = Object.assign(gql_variables,{id:id})

    const query = loader("./Warmup.graphql");
    const {loading, error, data} = useQuery(query, {
        variables:variables,
    });
    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const warmupData = get(data, "response.qna", {});
    
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
        <Col className={`slide quiz ${showQuiz?'':'d-none'}`}>
            <img src={`${files_endpoint}${quiz.cover}`} className="cover" alt={quiz.title}/>
            <h2>{quiz.title}
                <span>{quiz.subtitle}</span>
            </h2>
            <div className={"content"}>
                <div dangerouslySetInnerHTML={{__html:quiz.description}}></div>

                <Button variant="game4-quiz"
                        onClick={start}
                        disabled={disabled}>
                    Start
                </Button>

                <div className={"duration"}>
                    <FontAwesomeIcon icon={['far','clock']} />
                    {quiz.duration}
                </div>
            </div>
        </Col>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired,
    show:PropTypes.bool.isRequired,
    childIndex:PropTypes.number.isRequired,
    setChildIndex:PropTypes.func.isRequired,
    max:PropTypes.number.isRequired,
    getFinalScore:PropTypes.func.isRequired,
    quizKey:PropTypes.string.isRequired
}

export default Warmup;