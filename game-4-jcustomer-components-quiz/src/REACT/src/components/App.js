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
import { faHandPointLeft,faCheckDouble,faCheck,faTimesCircle,faTimes,faBan } from '@fortawesome/free-solid-svg-icons';
import { faClock,faCheckCircle} from '@fortawesome/free-regular-svg-icons';

//todo voir si je peux le desactiver dynamiquement
//todo comment bootstrap to build to jahia view
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
    faTimes,
    faBan
);

const Indicator = (props) =>{
    const {currentSlide} = props.state;
    const active = currentSlide === props.id;

    return(
        <li className={`${active ? 'active':''}`}
            onClick={ () => props.dispatch({case:"SHOW_SLIDE",slide:props.id}) }>
        </li>
    )
}

Indicator.propTypes={
    id:PropTypes.string.isRequired,
    state:PropTypes.object.isRequired,
    dispatch:PropTypes.func.isRequired
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

const initLanguageBundle = quizData => {
    const keys = [
        "btnStart",
        "btnSubmit",
        "btnQuestion",
        "btnNextQuestion",
        "btnShowResults",
        "consentTitle",
        "correctAnswer",
        "wrongAnswer"
    ];
    return keys.reduce((bundle,key)=>{
        bundle[key] = get(quizData,`${key}.value`);
        console.debug("bundle: ",bundle);
        return bundle;
    },{});
}

const initialState = {
    quiz:{consents:[],childNodes:[]},
    resultSet:[],//array of boolean, order is the same a slideSet
    currentResult:false,//previously result
    slideSet:[],//previously slideIndex
    currentSlide:null,//previously index
    showResult:false,
    showNext:false,
    showScore:false,
    max:-1,
    score:0
}

function init(initialState) {
    return initialState;
}

function reducer(state, action) {

    const showNext = ({slideSet,max,slide}) =>
        slideSet.indexOf(slide) < max;

    switch (action.case) {
        case "START": {
            //prepare slideIds
            const quiz = action.quiz;
            const slideSet = [quiz.id];
            quiz.childNodes.forEach(node => slideSet.push(node.id));
            slideSet.push(quiz.scoreIndex);

            const max = slideSet.length -1;

            return {
                ...state,
                quiz,
                currentSlide:quiz.id,
                slideSet,
                showNext:showNext({slideSet,max,slide:quiz.id}),
                max
            };
        }
        //previously ADD_RESULT
        case "SHOW_RESULT": {
            const currentResult = action.result;
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const showScore = currentIndex === state.max-1;

            console.debug("SHOW_RESULT - currentResult: ", currentResult);
            console.debug("SHOW_RESULT - showScore: ", showScore,", currentIndex: ",currentIndex,", max : ",state.max);
            return {
                ...state,
                showScore,
                resultSet: [...state.resultSet, currentResult],
                currentResult,
                showResult: true
            };
        }
        case "ADD_SLIDES": {
            const slides = action.slides;
            const parentSlide = action.parentSlide;
            let slideSet = state.slideSet;

            if (parentSlide && slideSet.includes(parentSlide)) {
                const position = slideSet.indexOf(parentSlide) + 1;
                slideSet.splice(position, 0, ...slides);
            } else {
                slideSet = [...slideSet, ...slides];
            }

            const max = slideSet.length -1;

            console.debug("ADD_SLIDE - slides: ",slides," parentSlide: ",parentSlide);
            return {
                ...state,
                slideSet,
                showNext:showNext({slideSet,max,slide:state.currentSlide}),
                max
            };
        }
        case "NEXT_SLIDE":{
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const nextIndex = currentIndex+1;

            console.debug("NEXT_SLIDE - currentIndex: ",currentIndex,", max : ",state.max);

            let nextSlide = state.currentSlide;
            let score = state.score;

            if(currentIndex  < state.max )
                nextSlide = state.slideSet[nextIndex];

            //next slide is the result page, time tp keep track of result in cdp
            if(nextIndex === state.max){
                const goodAnswers = state.resultSet.filter(result => result).length;
                const answers = state.resultSet.length;
                score = Math.floor((goodAnswers/answers)*100);
                uTracker.track("setQuizScore",{
                    score:`${state.quiz.key}${state.splitPattern}${score}`
                })
            }

            return {
                ...state,
                currentSlide:nextSlide,
                showNext: showNext({...state,slide:nextSlide}),
                showResult:false,
                score
            };
        }
        case "SHOW_SLIDE": {
            const slide = action.slide
            return {
                ...state,
                currentSlide: slide,
                showNext: showNext({...state, slide})
            };
        }
        case "RESET":
            // return init(action.payload);
            return initialState;
        default:
            throw new Error();
    }
}

//NOPE ! TODO jCustomer/context.json -> context. jContext.value = {context,jCustomer}
const App = ({context})=> {
    // console.log("App GET_QUIZ : ",GET_QUIZ);
    const {loading, error, data} = useQuery(GET_QUIZ, {
        variables:context.gql_variables,
    });

    const [state, dispatch] = React.useReducer(
        reducer,
        Object.assign({splitPattern:context.score_splitPattern},initialState)
        //init
    );
    const [cxs, setCxs] = React.useState(null);

    React.useEffect(() => {
        console.debug("App Quiz init !");
        if(loading === false && data){
            console.debug("App Quiz init Set Data!");

            const quizData = get(data, "response.quiz", {});
            const quiz = new _Quiz(quizData);
            context.language_bundle = initLanguageBundle(quizData);

            dispatch({case:"START",quiz});

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

    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <JContext.Provider value={context}>
            <Container>
                <Row>
                    <div className={`game4-quiz slide ${state.showResult?"show-result":""}`}>
                        <div className="game4-quiz__header">
                            <span className="game4-quiz__header-result">
                                {state.currentResult &&
                                    context.language_bundle &&
                                    context.language_bundle.correctAnswer}
                                {!state.currentResult &&
                                    context.language_bundle &&
                                    context.language_bundle.wrongAnswer}
                            </span>

                            <Button variant="game4-quiz-header"
                                    onClick={ () => dispatch({case:"NEXT_SLIDE"}) }
                                    disabled={!state.showNext}>
                                {!state.showScore &&
                                    context.language_bundle &&
                                    context.language_bundle.btnNextQuestion}
                                {state.showScore &&
                                    context.language_bundle &&
                                    context.language_bundle.btnShowResults}
                            </Button>

                        </div>

                        <ol className="game4-quiz__indicators">
                            {state.slideSet.map( itemId =>
                                <Indicator
                                    key={itemId}
                                    id={itemId}
                                    state={state}
                                    dispatch={dispatch}
                                />
                            )}
                        </ol>

                        <div className="game4-quiz__inner">
                            <Quiz
                                key={state.quiz.id}
                                state={state}
                                dispatch={dispatch}
                                cxs={cxs}
                            />
                            {state.quiz.childNodes.map( (node,i) => {
                                if(node.type === context.cnd_type.QNA)
                                    return <Qna
                                            key={node.id}
                                            id={node.id}
                                            state={state}
                                            dispatch={dispatch}
                                        />

                                if(node.type === context.cnd_type.WARMUP)
                                    return <Warmup
                                        key={node.id}
                                        id={node.id}
                                        state={state}
                                        dispatch={dispatch}
                                    />
                                return <p className="text-danger">node type {node.type} is not supported</p>
                                })
                            }
                            <Score
                                state={state}
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
