import React from 'react'; //useEffect,useContext
import PropTypes from "prop-types";

import {Container,Row} from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';

import uTracker from 'unomi-analytics';
import get from "lodash.get";

import Quiz from "components/Quiz";
import {JContext} from "contexts";
import {GET_QUIZ} from "components/Quiz/QuizGraphQL.js";

// import JCustomer from "jCustomer/index";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faHandPointLeft,faCheckDouble,faCheck,faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faClock,faCheckCircle} from '@fortawesome/free-regular-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/App.css';
import 'react-circular-progressbar/dist/styles.css';

library.add(
    fab,
    faClock,
    faHandPointLeft,
    faCheckCircle,
    faCheckDouble,
    faCheck,
    faTimesCircle
);
//NOPE ! TODO jCustomer/context.json -> context. jContext.value = {context,jCustomer}
const App = ({context})=> {

    console.log("App GET_QUIZ : ",GET_QUIZ);
    // const [context, setContext] = React.useState(cxs);
    const[childIndex,setChildIndex] = React.useState(-2);

    React.useEffect(() => {
        const id = context.gql_variables.id;
        //#Try unomi tracker implementation
        if(context.gql_variables.workspace === "LIVE")
            uTracker.initialize({
                "Apache Unomi": {
                    scope: context.scope,
                    url: context.cdp_endpoint,
                    sessionId:`qZ-${id}-${Date.now()}`
                }
            });
    }, []);

    // const {gql_variables} =  useContext(JContext);

    const {loading, error, data} = useQuery(GET_QUIZ, {
        variables:context.gql_variables,
    });
    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const quizData = get(data, "response.quiz", {});
    const quizKey = get(quizData, "key.value", {});
    const childNodes = get(quizData,"children.nodes",[])
    // console.log("childNodes array? ",Array.isArray(childNodes));
    // console.log("childNodes not empty : ",childNodes.length);

    const quizStartDisabled = !Array.isArray(childNodes) || childNodes.length===0;
    // console.log("disabled : ",disabled);
    
    // const [quiz,setQuiz] = React.useState({
    //     id:getRandomString(5,"#aA"),
    //     content:new DataLesson(dataLesson,context)
    // });

    // console.log("RunLesson context: ",context);


    const max = childNodes.length -1;


    const getFinalScore = () => {

    }

    return (
        <JContext.Provider value={context}>
            {/*<RunLesson dataLesson={dataLesson}></RunLesson>*/}
            <Container className="elearning">
                <Row>
                    <Quiz
                        key={quizData.id}
                        quizData={quizData}
                        showQuiz={childIndex === -2}
                        start={() => setChildIndex(0)}
                        disabled={quizStartDisabled}
                    />
                </Row>
                {/*{*/}
                {/*    childNodes.map( (childNode,i) =>*/}
                {/*        <Row key={childNode.id}>*/}
                {/*            <Chapter*/}
                {/*                childNode={childNode}*/}
                {/*                showChapter={childIndex === i}*/}
                {/*                childIndex={childIndex}*/}
                {/*                setChildIndex={setChildIndex}*/}
                {/*                max={max}*/}
                {/*                getFinalScore={lesson.content.getScore}*/}
                {/*                quizKey={quizKey}*/}
                {/*            />*/}
                {/*        </Row>*/}
                {/*    )*/}
                {/*}*/}
                {/*<Row>*/}
                {/*    <Result*/}
                {/*        quiz={quizData}*/}
                {/*        showResult={childIndex === -1}*/}
                {/*    />*/}
                {/*</Row>*/}
            </Container>
        </JContext.Provider>
    );
};

App.propTypes={
    context:PropTypes.object.isRequired
}

export default App;
