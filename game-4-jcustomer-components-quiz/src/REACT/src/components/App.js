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
import Score from "components/Score";
import {getRandomString} from "misc/utils";



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


class _Quiz{
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    constructor(quizData) {
        this.id= get(quizData, "id");
        this.type= get(quizData, "type.value")
        this.key = get(quizData, "key.value", {});
        this.title= get(quizData, "title", "");
        this.subtitle= get(quizData, "subtitle.value", "");
        this.description= get(quizData, "description.value", "");
        this.duration= get(quizData, "duration.value", "");
        // this.ctaLink= get(quizData, "ctaLink.value", "");
        this.cover= get(quizData, "cover.node.path", "");
        this.consents= get(quizData, "consents.nodes", []).map(node =>{
            return {
                id:get(node,"id"),
                actived:JSON.parse(get(node,"actived.value"))
            }
        });
        this.childNodes = get(quizData,"children.nodes",[]).map(node =>{
            return {
                id: get(node, "id"),
                type: get(node, "type.value")
            };
        });
        this.scoreIndex= getRandomString(5,"#aA");
    };
}

//NOPE ! TODO jCustomer/context.json -> context. jContext.value = {context,jCustomer}
const App = ({context})=> {
    // console.log("App GET_QUIZ : ",GET_QUIZ);
    const {loading, error, data} = useQuery(GET_QUIZ, {
        variables:context.gql_variables,
    });

    const [quiz, setQuiz] = React.useState({consents:[],childNodes:[]});

    const [showResult, setShowResult] = React.useState(false);
    const [result, setResult] = React.useState(false);
    const [resultSet, setResultSet] = React.useState([]);
    const [slideIndex, setSlideIndex] = React.useState([]);
    const [index, setIndex] = React.useState();
    const [cxs, setCxs] = React.useState({});

    const addItem2Slides = (ids,parentId) =>
        setSlideIndex(slideIndex => {
            console.debug("addItem2Slides__setSlideIndex; ids : ",ids,", parentId : ",parentId,", slideIndex : ",slideIndex);

            if (parentId && slideIndex.includes(parentId)) {
                const position = slideIndex.indexOf(parentId) + 1;
                slideIndex.splice(position, 0, ...ids);
                return [...slideIndex];
            } else {
                return [...slideIndex, ...ids];
            }
        });

    React.useEffect(() => {
        console.debug("App Quiz init !");
        if(loading === false && data){
            console.debug("App Quiz init Set Data!");

            const quizData = get(data, "response.quiz", {});
            const quiz = new _Quiz(quizData);

            const nodesIds = [quiz.id];
            quiz.childNodes.forEach(node => nodesIds.push(node.id));
            nodesIds.push(quiz.scoreIndex);

            addItem2Slides(nodesIds);

            setIndex(quiz.id);
            setQuiz(quiz);

            console.debug("App Quiz init");

            //init unomi tracker
            if(context.gql_variables.workspace === "LIVE"){
                uTracker.initialize({
                    "Apache Unomi": {
                        scope: context.scope,
                        url: context.cdp_endpoint,
                        sessionId:`qZ-${quiz.key}-${Date.now()}`
                    }
                });
                uTracker.ready( () => {
                    setCxs(window.cxs);
                })
            }


            context.content={
                id: quiz.id,
                type: get(quizData, "type.value")
            };
        }
    }, [loading,data]);

    React.useEffect(() => {
        //when an update occurs that means a new result was added. So it is time to show result
        console.debug("useEffect resultSet : ",resultSet);

        if(Array.isArray(resultSet) && resultSet.length >0){
            const result = resultSet.slice(-1);

            console.log("resultSet useEffect setResult result: ",result);
            console.log("resultSet useEffect setResult ...result: ",...result);
            setResult(...result);
            setShowResult(true);
        }

    },[resultSet])

    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const max = slideIndex.length -1;//quizChildNodes.length;//O is quiz child start at 1

    const showNext =
        slideIndex.indexOf(index) < max;

    const showScore =
        slideIndex.indexOf(index) === max-1;
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
        console.log("index : ",index);
        const current = slideIndex.indexOf(index);
        console.log("current : ",current);
        if(current < max)
            setIndex(slideIndex[current+1]);

        //keep track of result in cdp
        // if(current+1 === max)
        //     uTracker.track("setQuizScore",{
        //         quizKey : quiz.key,
        //         score:getFinalScore()
        //     })

    }

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const getFinalScore = () => {
        const goodAnswers = resultSet.filter(result => result).length;
        const answers = resultSet.length;
        return Math.floor((goodAnswers/answers)*100);
    }

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
                                {!showScore && "question suivante"}
                                {showScore && "mon score"}
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
                                key={quiz.id}
                                quiz={quiz}
                                show={ index===quiz.id }
                                onClickNext={onClickNext}
                                showNext={showNext}
                                cxs={cxs}
                            />
                            {quiz.childNodes.map( (node,i) => {
                                if(node.type === context.cnd_type.QNA)
                                    return <Qna
                                            key={node.id}
                                            id={node.id}
                                            show={index === node.id}
                                            // quizKey={quiz.key}
                                            resultSet={resultSet}
                                            setResultSet={setResultSet}
                                        />

                                if(node.type === context.cnd_type.WARMUP)
                                    return <Warmup
                                        key={node.id}
                                        id={node.id}
                                        show={index === node.id}
                                        // quizKey={quiz.key}
                                        resultSet={resultSet}
                                        setResultSet={setResultSet}
                                        addItem2Slides={addItem2Slides}
                                        index={index}
                                        onClickNext={onClickNext}
                                    />
                                return <p className="text-danger">node type {node.type} is not supported</p>
                                })
                            }
                            <Score
                                quiz={quiz}
                                show={index === quiz.scoreIndex}
                                score={getFinalScore}
                            />
                        </div>
                    </div>
                </Row>
            </Container>
        </JContext.Provider>
    );
};

App.propTypes={
    context:PropTypes.object.isRequired
}

export default App;
