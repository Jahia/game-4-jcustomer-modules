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

    console.log("App GET_QUIZ : ",GET_QUIZ);
    // const [context, setContext] = React.useState(cxs);
    // const[childIndex,setChildIndex] = React.useState(-2);
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

    // const {gql_variables} =  useContext(JContext);

    const {loading, error, data} = useQuery(GET_QUIZ, {
        variables:context.gql_variables,
    });
    // console.log(`useQuery: loading ->${loading}; error-> ${error} ; data ->${data}`);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const quizData = get(data, "response.quiz", {});
    const quizKey = get(quizData, "key.value", {});
    let childNodes = get(quizData,"children.nodes",[]);
    childNodes=childNodes.map(node =>{
        return {
            id: get(node, "id"),
            type: get(node, "type.value"),
        };
    })
    // console.log("childNodes array? ",Array.isArray(childNodes));
    // console.log("childNodes not empty : ",childNodes.length);


    // console.log("disabled : ",disabled);
    
    // const [quiz,setQuiz] = React.useState({
    //     id:getRandomString(5,"#aA"),
    //     content:new DataLesson(dataLesson,context)
    // });

    // console.log("RunLesson context: ",context);


    const max = childNodes.length -1;
    // const showStart = !Array.isArray(childNodes) || childNodes.length===0;
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
//className="game4-quiz"
    // onSelect={handleSelect}
//TODO gerer les btns de navigation next et header pour afficher les resutats
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


                            <div className="game4-quiz__item">
                                <img className="d-block w-100" src="..." alt="Second slide"/>
                            </div>
                            <div className="game4-quiz__item">
                                <img className="d-block w-100" src="..." alt="Third slide"/>
                            </div>
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
                    {/*        childNodes.map( (node,i) =>*/}
                    {/*            <Carousel.Item key={node.id}>*/}
                    {/*                { node.type == context.cnd_type.QNA ?*/}
                    {/*                    <Qna*/}
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
