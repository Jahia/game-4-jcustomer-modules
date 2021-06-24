import React from 'react'; //useEffect,useContext
// import PropTypes from "prop-types";

import {Grid,Typography} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';

import get from "lodash.get";

import {StoreContext} from "contexts";

import 'react-circular-progressbar/dist/styles.css';

import {GET_QUIZ} from "components/Quiz/QuizGraphQL.js";

import Quiz from "components/Quiz"
import Qna from "components/Qna";
import Warmup from "components/Warmup";
import Score from "components/Score";
import {syncTracker} from "misc/tracker";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'clsx';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'components/theme';
import Transition from "components/Transition";

const useStyles = makeStyles(theme => ({
    main: {
        position: "relative",
        "& *, &::after, &::before":{
            boxSizing:"border-box",
        }
    },
}));

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

const App = (props)=> {
    const classes = useStyles(props);

    const { state, dispatch } = React.useContext(StoreContext);
    const {
        jContent,
        quiz,
        showResult,
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
            // const quizKey = get(quizData, "key.value");

            jContent.language_bundle = initLanguageBundle(quizData);
            console.debug("jContent.language_bundle: ",jContent.language_bundle);

            dispatch({
                case:"DATA_READY",
                payload:{
                    quizData
                }
            });

            //Init unomi tracker
            if(jContent.gql_variables.workspace === "LIVE")
                syncTracker({
                    scope: jContent.scope,
                    url: jContent.cdp_endpoint,
                    // sessionId:`qZ-${quizKey}-${Date.now()}`,
                    dispatch
                });
        }
    }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;



    const displayScore=()=>{
        if(showScore)
            return <Score/>
    }

    return (
        <ThemeProvider theme={theme(quiz?quiz.userTheme:{})}>
        <Grid container spacing={3}>
            <Grid item xs style={{margin:'auto'}}>

                <div className={classnames(
                    classes.main,
                    (showResult?'showResult':'')
                )}>
                    <Transition/>
                    {quiz &&
                        <>
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
                            return <Typography color="error"
                                               component="p">
                                node type {node.type} is not supported
                            </Typography>

                        })
                        }
                        {displayScore()}

                        </>
                    }
                </div>
            </Grid>
        </Grid>
        </ThemeProvider>
    );
};

App.propTypes={}

export default App;
