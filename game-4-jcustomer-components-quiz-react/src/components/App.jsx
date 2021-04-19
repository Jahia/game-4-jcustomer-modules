import React from 'react'; //useEffect,useContext
import PropTypes from "prop-types";

import {Button, Container, Row} from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';

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
import {syncTracker} from "misc/tracker";


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
    const {id,enabled} = props;

    const active = currentSlide === id;
    const handleCLick = () =>{
        if(enabled)
            dispatch({
                case:"SHOW_SLIDE",
                payload:{
                    slide:id
                }
            });
    };

    return(
        <li className={`${active ? 'active':''} ${enabled ? 'clickable':''}`}
            onClick={handleCLick}>
        </li>
    )
}

Indicator.propTypes={
    id:PropTypes.string.isRequired,
    enabled:PropTypes.bool.isRequired
}

const initLanguageBundle = quizData => {
    const keys = [
        "btnStart",
        "btnSubmit",
        "btnQuestion",
        "btnNextQuestion",
        "btnShowResults",
        "btnReset",
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

    React.useEffect(() => {
        console.debug("App Quiz init !");
        if(loading === false && data){
            console.debug("App Quiz init Set Data!");

            const quizData = get(data, "response.quiz", {});
            const quizKey = get(quizData, "key.value");

            jContent.language_bundle = initLanguageBundle(quizData);
            console.debug("jContent.language_bundle: ",jContent.language_bundle);

            dispatch({
                case:"DATA_READY",
                payload:{
                    quizData
                }
            });

            //init unomi tracker
            if(jContent.gql_variables.workspace === "LIVE")
                syncTracker({
                    scope: jContent.scope,
                    url: jContent.cdp_endpoint,
                    sessionId:`qZ-${quizKey}-${Date.now()}`,
                    dispatch
                });
        }
    }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleNextSlide = () =>
        dispatch({
            case:"NEXT_SLIDE"
        });

    const handleShowScore = () =>
        dispatch({
            case:"SHOW_SCORE"
        });

    return (
        <Container>
            <Row>
                <div className={`game4-quiz slide ${showResult?"show-result":""}`}>
                    {jContent.language_bundle &&
                        <div className="game4-quiz__header">

                                <span className="game4-quiz__header-result">
                                    {currentResult &&
                                        jContent.language_bundle.correctAnswer}
                                    {!currentResult &&
                                        jContent.language_bundle.wrongAnswer}
                                </span>
                                {!showScore &&
                                    <Button variant="game4-quiz-header"
                                        onClick={handleNextSlide}
                                        disabled={!showNext}>
                                        {jContent.language_bundle.btnNextQuestion}
                                    </Button>
                                }
                                {showScore &&
                                    <Button variant="game4-quiz-header"
                                        onClick={handleShowScore}
                                        disabled={!showNext}>
                                        {jContent.language_bundle.btnShowResults}
                                    </Button>
                                }

                        </div>
                    }
                    <ol className="game4-quiz__indicators">
                        {slideSet.map( itemId =>
                            <Indicator
                                key={itemId}
                                id={itemId}
                                enabled={jContent.allow_indicator_browsing}
                            />
                        )}
                    </ol>
                    {quiz &&
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
                    }
                </div>
            </Row>
        </Container>
    );
};

App.propTypes={}

export default App;
