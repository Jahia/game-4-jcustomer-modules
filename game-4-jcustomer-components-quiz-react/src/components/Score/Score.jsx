import React from 'react';
import {StoreContext} from "contexts";
import {Button} from "react-bootstrap";
import Media from "components/Media";
import Personalized from "components/Score/personalized/Personalized";
import Percentage from "components/Score/percentage/Percentage";

const Score = (props) => {
    const { state,dispatch } = React.useContext(StoreContext);
    const { quiz,currentSlide,score,scoreIndex,jContent,cxs } = state;
    const { language_bundle } =  jContent;

    const show = currentSlide === scoreIndex;

    const onClick = () => {
        dispatch({
            case:"RESET"
        });
    }
    const displayResult = () => {
        if(quiz.personalizedResult.id){
            if(cxs)
                return <Personalized id={quiz.personalizedResult.id} cxs={cxs}/>
            return <p>cxs is loading...</p>
        }
        return <Percentage score={score}/>
    }
    // {quiz.personalizedResult.id && <Personalized id={quiz.personalizedResult.id}/>}
    // {!quiz.personalizedResult.id && <Percentage score={score}/>}
    // <div className="game4-quiz__score-result col-6 offset-3 col-md-4 offset-md-4 mb-5">
    //     <CircularProgressbar value={score} text={`${score}%`}/>
    // </div>
    console.log("[Score] quiz.personalizedResult.id: ",quiz.personalizedResult.id);
    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            {quiz.media &&
            <Media id={quiz.media.id}
                   type={quiz.media.type.value}
                   mixins={quiz.media.mixins.map(mixin=>mixin.value)}
                   path={quiz.media.path}
                   alt={quiz.title}
            />
            }
            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{quiz.title}<span className="subtitle">{quiz.subtitle}</span></h2>
                {displayResult()}
                <Button variant="game4-quiz"
                        onClick={onClick}>
                    {language_bundle && language_bundle.btnReset}
                </Button>
            </div>
        </div>
    );
}

// Personalized.propTypes={}

export default Score;