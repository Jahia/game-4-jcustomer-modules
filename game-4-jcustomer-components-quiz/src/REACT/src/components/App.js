import React from 'react'; //useEffect,useContext
import PropTypes from "prop-types";

import {Button, Container, Row} from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';

import uTracker from 'unomi-analytics';
import get from "lodash.get";

import {JContext} from "contexts";

// import JCustomer from "jCustomer/index";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faHandPointLeft,faCheckDouble,faCheck,faTimesCircle,faTimes } from '@fortawesome/free-solid-svg-icons';
import { faClock,faCheckCircle} from '@fortawesome/free-regular-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/App.scss';
import 'react-circular-progressbar/dist/styles.css';

import {GET_QUIZ} from "components/Quiz/QuizGraphQL.js";
import Quiz from "components/Quiz"
import Qna from "components/Qna";
import Warmup from "components/Warmup";



library.add(
    fab,
    faClock,
    faHandPointLeft,
    faCheckCircle,
    faCheckDouble,
    faCheck,
    faTimesCircle,
    faTimes
);

const Indicator = ({active,handleSelect}) =>{
    // console.log("active :",active);
    // console.log("handleSelect :",handleSelect);
    return(
        <li className={`${active ? 'active':''}`}
            onClick={handleSelect}>
        </li>
    )
}


//NOPE ! TODO jCustomer/context.json -> context. jContext.value = {context,jCustomer}
const App = ({context})=> {
    // console.log("App GET_QUIZ : ",GET_QUIZ);
    const {loading, error, data} = useQuery(GET_QUIZ, {
        variables:context.gql_variables,
    });

    const [quizData, setQuizData] = React.useState({});
    const [quizKey, setQuizKey] = React.useState();
    const [quizChildNodes, setQuizChildNodes] = React.useState([]);
    const [showResult, setShowResult] = React.useState(false);
    const [result, setResult] = React.useState(false);
    const [resultSet, setResultSet] = React.useState([]);
    const [slideIndex, setSlideIndex] = React.useState([]);
    const [index, setIndex] = React.useState();

    // const addItem2Slides = (id) => setSlideIndex(slideIndex=>[...slideIndex,id]);

    const addItem2Slides = (ids,parentId) =>
        setSlideIndex(slideIndex => {
            console.debug("addItem2Slides__setSlideIndex; ids : ",ids,", parentId : ",parentId);
            console.debug("addItem2Slides__setSlideIndex; slideIndex : ",slideIndex);
            if (parentId && slideIndex.includes(parentId)) {
                const position = slideIndex.indexOf(parentId) + 1;
                slideIndex.splice(position, 0, ...ids);
                return [...slideIndex];
            } else {
                return [...slideIndex, ...ids];
            }
        });

    React.useEffect(() => {
        console.log("App Quiz init !");
        if(loading === false && data){
            console.log("App Quiz init Set Data!");
            const nodesIds = [];
            const quizData = get(data, "response.quiz", {});
            const quizId = get(quizData, "id");
            nodesIds.push(quizId);


            console.log("App Quiz init slideIndex : ",slideIndex);

            const quizChildNodes = get(quizData,"children.nodes",[]).map(node =>{
                const nodeId = get(node, "id");
                nodesIds.push(nodeId);
                return {
                    id: nodeId,
                    type: get(node, "type.value")
                };
            })
            addItem2Slides(nodesIds);
            setIndex(quizId);

            const quizKey = get(quizData, "key.value", {});
            //init unomi tracker
            if(context.gql_variables.workspace === "LIVE")
                uTracker.initialize({
                    "Apache Unomi": {
                        scope: context.scope,
                        url: context.cdp_endpoint,
                        sessionId:`qZ-${quizKey}-${Date.now()}`
                    }
                });

            context.content={
                id: quizId,
                type: get(quizData, "type.value")
            };

            setQuizData(quizData);
            setQuizKey(quizKey);
            setQuizChildNodes(quizChildNodes);
        }
    }, [loading,data]);

    React.useEffect(() => {
        //when an update occurs that means a new result was added. So it is time to show result
        console.log("resultSet useEffect init");

        if(Array.isArray(resultSet) && resultSet.length >0){
            console.log("resultSet useEffect setResult")
            const result = resultSet.slice(-1);
            setResult(...result);
            setShowResult(true);
        }

    },[resultSet])

    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
// console.log("App redo!");


    // console.log("disabled : ",disabled);
    
    // const [quiz,setQuiz] = React.useState({
    //     id:getRandomString(5,"#aA"),
    //     content:new DataLesson(dataLesson,context)
    // });

    // console.log("RunLesson context: ",context);


    const max = slideIndex.length -1;//quizChildNodes.length;//O is quiz child start at 1
    // const showStart = !Array.isArray(quizChildNodes) || quizChildNodes.length===0;
    // const showPrev = setSlideIndex.indexOf(index)>0;
    const showNext =
        // index !==-1 &&
        // quizDone &&
        slideIndex.indexOf(index) < max;

    // const showFinalResult =
    //     index === max &&
    //     quizDone;

    // const handleClose = () => {
    //     if(modalIndex === maxQuizIndex)
    //         setQuizDone(true);
    //     setModalIndex(-2);
    // }
    // const handleStart = () => setModalIndex(startIndex);

    // No prev button in this quiz
    // const onClickPrev = () => {
    //     if(index.indexOf(indexValue) > 0)
    //         setIndex(index-1);
    // }

    const onClickNext = () => {
        setShowResult(false);
        const current = slideIndex.indexOf(index);
        if(current < max)
            setIndex(slideIndex[current+1]);
    }

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const getFinalScore = () => {

    }

//TODO ajouter un layer visible si showResult et afficher le btns de navigation next
    return (
        <JContext.Provider value={context}>
            <Container>
                <Row>
                    <div className={`game4-quiz slide ${showResult?"show-result":""}`}>
                        <div className="game4-quiz__header">
                            <span className="game4-quiz__header-result">
                                {result && "correct"}
                                {!result && "incorrect"}
                            </span>
                            <Button variant="game4-quiz-header"
                                    onClick={onClickNext}
                                    disabled={!showNext}>
                                question suivante
                            </Button>
                        </div>

                        <ol className="game4-quiz__indicators">
                            {slideIndex.map( itemId =>
                                <Indicator
                                    key={itemId}
                                    active={index=== itemId}
                                    handleSelect={()=>handleSelect(itemId)}
                                />
                            )}
                        </ol>

                        <div className="game4-quiz__inner">
                            <Quiz
                                key={quizData.id}
                                quizData={quizData}
                                show={ index===quizData.id }
                                onClickNext={onClickNext}
                                showNext={showNext}
                            />
                            {quizChildNodes.map( (node,i) =>{
                                if(node.type === context.cnd_type.QNA)
                                    return <Qna
                                            key={node.id}
                                            id={node.id}
                                            show={index === node.id}
                                            quizKey={quizKey}
                                            resultSet={resultSet}
                                            setResultSet={setResultSet}
                                        />

                                if(node.type === context.cnd_type.WARMUP)
                                    return <Warmup
                                        key={node.id}
                                        id={node.id}
                                        show={index === node.id}
                                        quizKey={quizKey}
                                        resultSet={resultSet}
                                        setResultSet={setResultSet}
                                        addItem2Slides={addItem2Slides}
                                        index={index}
                                    />
                                })
                            }
                            {/*TODO add a slide result here*/}
                        </div>
                        <a className="game4-quiz__control-prev" href="#carouselExampleIndicators" role="button"
                           data-slide="prev">
                            <span className="game4-quiz__control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="game4-quiz__control-next" href="#carouselExampleIndicators" role="button"
                           data-slide="next">
                            <span className="game4-quiz__control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </Row>

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
