import React from 'react'; //useEffect,useContext
import PropTypes from "prop-types";

import {Button, Container, Row} from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';

import uTracker from 'unomi-analytics';
import get from "lodash.get";

import {StoreContext} from "contexts";

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
    const { state, dispatch } = React.useContext(StoreContext);
    const {currentSlide} = state;

    const active = currentSlide === props.id;
    const handleCLick = () =>
        dispatch({
            case:"SHOW_SLIDE",
            payload:{
                slide:props.id
            }
        });

    return(
        <li className={`${active ? 'active':''}`}
            onClick={handleCLick}>
        </li>
    )
}

Indicator.propTypes={
    id:PropTypes.string.isRequired,
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
        // console.debug("bundle: ",bundle);
        return bundle;
    },{});
}

//NOPE ! TODO jCustomer/context.json -> context. jContext.value = {context,jCustomer}
const App = (props)=> {
    // console.log("App GET_QUIZ : ",GET_QUIZ);
    const { state, dispatch } = React.useContext(StoreContext);
    const {
        jContent,
        quiz,
        slideSet,
        currentResult,
        showResult,
        showNext,
        showScore
    } = state;


    const {loading, error, data} = useQuery(GET_QUIZ, {
        variables:jContent.gql_variables,
    });

    // const [cxs, setCxs] = React.useState(null);

    React.useEffect(() => {
        console.debug("App Quiz init !");
        if(loading === false && data){
            console.debug("App Quiz init Set Data!");

            const quizData = get(data, "response.quiz", {});
            const quiz = new _Quiz(quizData);
            jContent.language_bundle = initLanguageBundle(quizData);

            console.debug("jContent.language_bundle: ",jContent.language_bundle);

            dispatch({
                case:"START",
                payload:{
                    quiz
                }
            });

            //init unomi tracker
            if(jContent.gql_variables.workspace === "LIVE"){
                uTracker.initialize({
                    "Apache Unomi": {
                        scope: jContent.scope,
                        url: jContent.cdp_endpoint,
                        sessionId:`qZ-${quiz.key}-${Date.now()}`
                    }
                });
                uTracker.ready( () =>
                    dispatch({
                        case:"ADD_CXS",
                        payload:{
                            cxs:window.cxs
                        }
                    })
                );
            }
        }
    }, [loading,data]);

    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleNextSlide = () =>
        dispatch({
            case:"NEXT_SLIDE"
        });

    return (
        <Container>
            <Row>
                <div className={`game4-quiz slide ${showResult?"show-result":""}`}>
                    <div className="game4-quiz__header">
                        <span className="game4-quiz__header-result">
                            {currentResult &&
                                jContent.language_bundle &&
                                jContent.language_bundle.correctAnswer}
                            {!currentResult &&
                                jContent.language_bundle &&
                                jContent.language_bundle.wrongAnswer}
                        </span>

                        <Button variant="game4-quiz-header"
                                onClick={handleNextSlide}
                                disabled={!showNext}>
                            {!showScore &&
                                jContent.language_bundle &&
                                jContent.language_bundle.btnNextQuestion}
                            {showScore &&
                                jContent.language_bundle &&
                                jContent.language_bundle.btnShowResults}
                        </Button>

                    </div>

                    <ol className="game4-quiz__indicators">
                        {slideSet.map( itemId =>
                            <Indicator
                                key={itemId}
                                id={itemId}
                            />
                        )}
                    </ol>

                    <div className="game4-quiz__inner">
                        <Quiz
                            key={quiz.id}
                        />
                        {quiz.childNodes.map( (node,i) => {
                            if(node.type === jContent.cnd_type.QNA)
                                return <Qna
                                        key={node.id}
                                        id={node.id}
                                    />

                            if(node.type === jContent.cnd_type.WARMUP)
                                return <Warmup
                                    key={node.id}
                                    id={node.id}
                                />
                            return <p className="text-danger">node type {node.type} is not supported</p>
                            })
                        }

                        <Score/>

                    </div>
                </div>
            </Row>
        </Container>
    );
};

App.propTypes={}

export default App;
