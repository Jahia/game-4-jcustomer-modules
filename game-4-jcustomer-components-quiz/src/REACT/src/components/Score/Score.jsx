import React from 'react';
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';
import {StoreContext} from "contexts";
import {Button} from "react-bootstrap";
import Media from "components/Media";

const Score = (props) => {
    const { state,dispatch } = React.useContext(StoreContext);
    const { quiz,currentSlide,score,scoreIndex,jContent } = state;
    const { files_endpoint,language_bundle } =  jContent;

    const show = currentSlide === scoreIndex;

    const onClick = () => {
        dispatch({
            case:"RESET"
        });
    }

    // console.log("Score props.show :",props.show);
    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            {quiz.media &&
            <Media id={quiz.media.id}
                   type={quiz.media.type.value}
                   path={quiz.media.path}
                   alt={quiz.title}
            />
            }
            <div className="game4-quiz__caption d-none d-md-block">
                <h2 className="text-uppercase">{quiz.title}<span className="subtitle">{quiz.subtitle}</span></h2>
                <div className="game4-quiz__score-result col-6 offset-3 col-md-4 offset-md-4 mb-5">
                    <CircularProgressbar value={score} text={`${score}%`}/>
                </div>

                <Button variant="game4-quiz"
                        onClick={onClick}>
                    {language_bundle && language_bundle.btnReset}
                </Button>
            </div>
        </div>
    );
}

Score.propTypes={}

export default Score;