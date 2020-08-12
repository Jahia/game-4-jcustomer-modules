import uTracker from "unomi-analytics";
import React from "react";
import {StoreContext} from "contexts";

const init = jContent => {
    return {
        jContent:{...jContent},
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
        cxs:null
    }
}

const reducer = (state, action) => {
    const { payload } = action;

    const showNext = ({slideSet,max,slide}) =>
        slideSet.indexOf(slide) < max;

    switch (action.case) {
        case "START": {
            //prepare slideIds
            const quiz = payload.quiz;
            console.debug("START - quiz: ",quiz);
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
            console.debug("ADD_CXS - cxs: ",cxs);
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
                    score:`${state.quiz.key}${state.jContent.score_splitPattern}${score}`
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
            const slide = payload.slide
            console.debug("SHOW_SLIDE - slide: ",slide);
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
        case "RESET": {
            //TODO voir ce truc
            console.debug("RESET - jContent: ",payload.jContent);
            return {
                ...init(payload.jContent),
                quiz:payload.quiz
            }
        }
        default:
            throw new Error();
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