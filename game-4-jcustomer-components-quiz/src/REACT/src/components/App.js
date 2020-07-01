import React from 'react'; //useEffect,useContext
import PropTypes from "prop-types";

import {Container,Row,Carousel} from 'react-bootstrap';
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
import 'components/App.scss';
import 'react-circular-progressbar/dist/styles.css';
import Qna from "components/Qna";
import QuizChild from "components/QuizChild";

library.add(
    fab,
    faClock,
    faHandPointLeft,
    faCheckCircle,
    faCheckDouble,
    faCheck,
    faTimesCircle
);

const Indicator = ({active,handleSelect}) =>{
    console.log("active :",active);
    console.log("handleSelect :",handleSelect);
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
    const [index, setIndex] = React.useState(0);

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

    React.useEffect(() => {
        console.log("App Quiz init !");
        if(loading === false && data){
            const quizData = get(data, "response.quiz", {});
            const quizKey = get(quizData, "key.value", {});
            let quizChildNodes = get(quizData,"children.nodes",[]);
            quizChildNodes=quizChildNodes.map(node =>{
                return {
                    id: get(node, "id"),
                    type: get(node, "type.value"),
                };
            })
            setQuizData(quizData);
            setQuizKey(quizKey);
            setQuizChildNodes(quizChildNodes);
        }
    }, [loading,data]);



    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
console.log("App redo!");


    // console.log("disabled : ",disabled);
    
    // const [quiz,setQuiz] = React.useState({
    //     id:getRandomString(5,"#aA"),
    //     content:new DataLesson(dataLesson,context)
    // });

    // console.log("RunLesson context: ",context);


    const max = quizChildNodes.length;//O is quiz child start at 1
    // const showStart = !Array.isArray(quizChildNodes) || quizChildNodes.length===0;
    const showPrev = index>0;
    const showNext =
        index !==-1 &&
        // quizDone &&
        index < max;

    // const showFinalResult =
    //     index === max &&
    //     quizDone;

    // const handleClose = () => {
    //     if(modalIndex === maxQuizIndex)
    //         setQuizDone(true);
    //     setModalIndex(-2);
    // }
    // const handleStart = () => setModalIndex(startIndex);


    const onClickPrev = () => {
        if(index > 0)
            setIndex(index-1);
    }

    const onClickNext = () => {
        if(index < max)
            setIndex(index+1);
    }

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const getFinalScore = () => {

    }

    const indicator = () =>{
        const indicator=[];
        for(let i=0; i<=max; i++){
            indicator.push(<Indicator
                key={i}
                active={index===i}
                handleSelect={()=>handleSelect(i)}
            />);
        }
        return indicator;
    }
//TODO ajouter un layer visible si showResult et afficher le btns de navigation next
    return (
        <JContext.Provider value={context}>
            {/*<RunLesson dataLesson={dataLesson}></RunLesson>*/}
            <Container>
                <Row>
                    <div className="game4-quiz slide" data-ride="carousel">
                        <ol className="game4-quiz__indicators">
                            {indicator()}
                        </ol>

                        <div className="game4-quiz__inner">
                            <Quiz
                                key={quizData.id}
                                quizData={quizData}
                                show={ index===0 }
                                onClickNext={onClickNext}
                                showNext={showNext}
                            />
                            {quizChildNodes.map( (node,i) =>
                                <QuizChild
                                    key={node.id}
                                    node={node}
                                    show={index === i+1}
                                    quizKey={quizKey}
                                />
                            )}
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

                    {/*<Carousel activeIndex={index}*/}
                    {/*          controls={false}*/}
                    {/*          interval={0}>*/}
                    {/*    <Carousel.Item>*/}
                    {/*        <Quiz*/}
                    {/*            key={quizData.id}*/}
                    {/*            quizData={quizData}*/}
                    {/*            onClickNext={onClickNext}*/}
                    {/*            showNext={showNext}*/}
                    {/*        />*/}
                    {/*    </Carousel.Item>*/}
                    {/*    {*/}
                    {/*        quizChildNodes.map( (node,i) =>*/}
                    {/*            <Carousel.Item key={node.id}>*/}
                    {/*                { node.type == context.cnd_type.QNA ?*/}
                    {/*                    <Answer*/}
                    {/*                        id={node.id}*/}
                    {/*                        myi={}*/}
                    {/*                        getFinalScore={getFinalScore}*/}
                    {/*                        quizKey={quizKey}*/}
                    {/*                    />*/}
                    {/*                }*/}

                    {/*            /!*<Row key={childNode.id}>*!/*/}
                    {/*                <QuizChild*/}
                    {/*                    childNode={childNode}*/}
                    {/*                    show={childIndex === i}*/}
                    {/*                    childIndex={childIndex}*/}
                    {/*                    setChildIndex={setChildIndex}*/}
                    {/*                    max={max}*/}
                    {/*                    getFinalScore={getFinalScore}*/}
                    {/*                    quizKey={quizKey}*/}
                    {/*                />*/}
                    {/*            /!*</Row>*!/*/}
                    {/*            </Carousel.Item>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*</Carousel>*/}
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
