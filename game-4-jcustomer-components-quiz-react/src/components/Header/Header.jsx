import Indicator from "components/Header/Indicator";
import {Button, Typography} from "@material-ui/core";
import React from "react";
import {StoreContext} from "contexts";
import {makeStyles} from "@material-ui/core/styles";
import {manageTransition} from "misc/utils";

const useStyles = makeStyles(theme => ({
    header:{
        zIndex: 2,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        width:'100%',
        padding: `${theme.spacing(2)}px ${theme.geometry.caption.padding.lg}`,
        [theme.breakpoints.between('xs', 'sm')]: {
            padding: `${theme.spacing(2)}px ${theme.geometry.caption.padding.main}`,
        },
        '.showResult &':{
            backgroundColor: theme.palette.grey['300'],
        }
    },
    headerIndicators: {
        display: 'flex',
        justifyContent: 'center',
        zIndex:1,
        listStyle: 'none',
        padding:0,
        marginTop:0,
        marginBottom: `${theme.spacing(2)}px`,
        '.showResult &':{
            marginBottom:0,
            [theme.breakpoints.between('xs', 'sm')]: {
                marginBottom:`${theme.spacing(1)}px`
            }
        }
    },
    headerResult:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 0,
        width:'100%',
        overflow:"hidden",
        transition:theme.transitions.create(['height'],{
            duration: theme.transitions.duration.standard,//'10s',//
            easing: theme.transitions.easing.header,
        }),
        ".showResult &":{
            height: theme.geometry.header.result.height,//'45px',//'auto',
            marginBottom: `${theme.spacing(1)}px`

        }
    },
    headerText:{
        textTransform: 'capitalize',
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.grey[700],
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize:'1.75rem'
        }
    },
}));

const Header = (props) => {
    const classes = useStyles(props);
    // const sharedClasses = cssSharedClasses(props);
    const { state, dispatch } = React.useContext(StoreContext);
    const {
        jContent,
        slideSet,
        currentResult,
        showNext,
        showScore,
        // transitionTimeout,
        // transitionIsEnabled,
        browsingIsEnabled
    } = state;

    const handleNextSlide = () =>
        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });
    // {
    //     if(transitionIsEnabled){
    //         dispatch({
    //             case:"TOGGLE_TRANSITION"
    //         });
    //         setTimeout(()=>dispatch({
    //             case:"TOGGLE_TRANSITION"
    //         }),transitionTimeout);
    //         setTimeout(()=>dispatch({
    //             case:"NEXT_SLIDE"
    //         }),transitionTimeout);
    //     }else{
    //         dispatch({
    //             case:"NEXT_SLIDE"
    //         })
    //     }
    // }

    const handleShowScore = () =>
        manageTransition({
            state,
            dispatch,
            payload:{
                case:"SHOW_SCORE"
            }
        });
        // if(transitionIsEnabled){
        //     dispatch({
        //         case:"TOGGLE_TRANSITION"
        //     });
        //     setTimeout(()=>dispatch({
        //         case:"TOGGLE_TRANSITION"
        //     }),transitionTimeout);
        //     setTimeout(()=>dispatch({
        //         case:"SHOW_SCORE"
        //     }),transitionTimeout);
        // }else{
        //     dispatch({
        //         case:"SHOW_SCORE"
        //     })
        // }


    const getHeaderResultLabel=()=>{
        if(currentResult)
            return jContent.language_bundle.correctAnswer;
        return jContent.language_bundle.wrongAnswer;
    }

    const getHeaderBtnNext=()=>{
        if(showScore)
            return  <Button onClick={handleShowScore}
                            disabled={!showNext}>
                {jContent.language_bundle.btnShowResults}
            </Button>
        return  <Button onClick={handleNextSlide}
                        disabled={!showNext}>
            {jContent.language_bundle.btnNextQuestion}
        </Button>
    }

    return(
        <div className={classes.header}>
            <ol className={classes.headerIndicators}>
                {slideSet.map( itemId =>
                    <Indicator
                        key={itemId}
                        id={itemId}
                        enabled={browsingIsEnabled}
                    />
                )}
            </ol>
            {jContent.language_bundle &&
            <div className={classes.headerResult}>
                <Typography className={classes.headerText}
                            variant="h4">
                    {getHeaderResultLabel()}
                </Typography>

                {getHeaderBtnNext()}
            </div>
            }
        </div>
    )
};
export default Header;