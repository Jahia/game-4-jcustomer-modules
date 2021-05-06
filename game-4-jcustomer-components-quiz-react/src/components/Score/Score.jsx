import React from 'react';
import {StoreContext} from "contexts";

import Media from "components/Media";
import Personalized from "components/Score/personalized/Personalized";
import Percentage from "components/Score/percentage/Percentage";
import cssSharedClasses from "components/cssSharedClasses";
import classnames from "clsx";
import {Typography,Button} from "@material-ui/core";
import Header from "components/Header/Header";

const Score = (props) => {
    const sharedClasses = cssSharedClasses(props);
    const { state,dispatch } = React.useContext(StoreContext);
    const {
        quiz,
        currentSlide,
        score,
        scoreIndex,
        jContent,
        cxs,
        transitionIsEnabled,
        transitionTimeout,
        resetBtnIsEnabled
    } = state;
    const { language_bundle } =  jContent;

    const show = currentSlide === scoreIndex;

    const onClick = () => {
        if(transitionIsEnabled){
            dispatch({
                case:"TOGGLE_TRANSITION"
            });
            setTimeout(()=>dispatch({
                case:"TOGGLE_TRANSITION"
            }),transitionTimeout);
            setTimeout(()=>dispatch({
                case:"RESET"
            }),transitionTimeout);
        }else{
            dispatch({
                case:"RESET"
            })
        }
    }
    const displayResult = () => {
        if(quiz.personalizedResult.id){
            if(cxs)
                return <Personalized id={quiz.personalizedResult.id} cxs={cxs}/>
            return <p>cxs is loading...</p>
        }
        return <Percentage score={score}/>
    }

    const getResetBtn = () => {
        if(!resetBtnIsEnabled)
            return;

        return <Button onClick={onClick}>
            {language_bundle && language_bundle.btnReset}
        </Button>
    }

    return(
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            <Header/>
            {quiz.media &&
            <Media id={quiz.media.id}
                   type={quiz.media.type?quiz.media.type.value:null}
                   mixins={quiz.media.mixins?quiz.media.mixins.map(mixin=>mixin.value):[]}
                   path={quiz.media.path}
                   alt={quiz.title}
            />
            }
            <div className={classnames(
                sharedClasses.caption,
                sharedClasses.captionMain
            )}>
                <Typography className={sharedClasses.textUppercase}
                            variant="h3">
                    {quiz.title}
                </Typography>
                <Typography className={sharedClasses.subtitle}
                            color="primary"
                            variant="h4">
                    {quiz.subtitle}
                </Typography>

                {displayResult()}

                {getResetBtn()}
            </div>
        </div>
    );

}

// Personalized.propTypes={}

export default Score;