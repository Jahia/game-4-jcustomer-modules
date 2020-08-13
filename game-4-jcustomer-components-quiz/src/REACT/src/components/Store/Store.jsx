import uTracker from "unomi-analytics";
import React from "react";
import {StoreContext} from "contexts";

const init = jContent => {
    return {
        jContent,
        quiz:{consents:[],childNodes:[]},
        resultSet:[],//array of boolean, order is the same a slideSet
        currentResult:false,//previously result
        slideSet:[],//previously slideIndex
        currentSlide:null,//previously index
        showResult:false,
        showNext:false,
        showScore:false,
        max:-1,
        score:0,
        cxs:null,
        reset:false
    }
}

const reducer = (state, action) => {
    const { payload } = action;

    const showNext = ({slideSet,max,slide}) =>
        slideSet.indexOf(slide) < max;

    switch (action.case) {
        case "DATA_READY": {
            //prepare slideIds
            const quiz = payload.quiz;
            console.debug("[STORE] DATA_READY - quiz: ",quiz);
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
        case "ADD_CXS": {
            const cxs = payload.cxs;
            console.debug("[STORE] ADD_CXS - cxs: ",cxs);
            return {
                ...state,
                cxs
            };
        }
        case "ADD_SLIDES": {
            const slides = payload.slides;
            const parentSlide = payload.parentSlide;
            let slideSet = state.slideSet;

            if (parentSlide && slideSet.includes(parentSlide)) {
                const position = slideSet.indexOf(parentSlide) + 1;
                slideSet.splice(position, 0, ...slides);
            } else {
                slideSet = [...slideSet, ...slides];
            }

            const max = slideSet.length -1;

            console.debug("[STORE] ADD_SLIDE - slides: ",slides," parentSlide: ",parentSlide);
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

            console.debug("[STORE] NEXT_SLIDE - currentIndex: ",currentIndex,", max : ",state.max);

            let nextSlide = state.currentSlide;
            // let score = state.score;

            if(currentIndex  < state.max )
                nextSlide = state.slideSet[nextIndex];

            return {
                ...state,
                currentSlide:nextSlide,
                showNext: showNext({...state,slide:nextSlide}),
                showResult:false,
                reset:false
                // score
            };
        }
        case "SHOW_SLIDE": {
            const slide = payload.slide
            console.debug("[STORE] SHOW_SLIDE - slide: ",slide);
            return {
                ...state,
                currentSlide: slide,
                showNext: showNext({...state, slide})
            };
        }
        case "SHOW_RESULT": {
            const currentResult = payload.result;
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const showScore = currentIndex === state.max-1;

            console.debug("[STORE] SHOW_RESULT - currentResult: ", currentResult);
            // console.debug("SHOW_RESULT - showScore: ", showScore,", currentIndex: ",currentIndex,", max : ",state.max);
            return {
                ...state,
                showScore,
                resultSet: [...state.resultSet, currentResult],
                currentResult,
                showResult: true
            };
        }
        case "SHOW_SCORE": {
            console.debug("[STORE] SHOW_SCORE");
            const [slide] = state.slideSet.slice(-1);

            const goodAnswers = state.resultSet.filter(result => result).length;
            const answers = state.resultSet.length;
            const score = Math.floor((goodAnswers/answers)*100);

            uTracker.track("setQuizScore",{
                score:`${state.quiz.key}${state.jContent.score_splitPattern}${score}`
            })

            return {
                ...state,
                currentSlide: slide,
                showNext: showNext({...state, slide}),
                showResult:false,
                score
            };
        }
        case "RESET": {
            console.debug("[STORE] RESET");

            const [currentSlide] = state.slideSet.slice(0,1);
            console.debug("[STORE] RESET slideSet",state.slideSet);

            return {
                ...state,
                currentSlide,
                resultSet:[],
                currentResult:false,
                reset:true
            }
        }
        default:
            throw new Error(`STORE action case '${action.case}' is unknown `);
    };
}

export const Store = props => {
    const [state, dispatch] = React.useReducer(
        reducer,
        props.jContent,
        init
    );
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {props.children}
        </StoreContext.Provider>
    );
};