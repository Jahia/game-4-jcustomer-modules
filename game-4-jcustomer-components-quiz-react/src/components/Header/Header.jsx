import Indicator from "components/Header/Indicator";
import {Button, Typography} from "@material-ui/core";
import React from "react";
import {StoreContext} from "contexts";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    header:{
        zIndex: 2,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        padding: `${theme.spacing(2)}px ${theme.geometry.caption.padding}`,
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
        showScore
    } = state;

    const handleNextSlide = () =>
        dispatch({
            case:"NEXT_SLIDE"
        });

    const handleShowScore = () =>
        dispatch({
            case:"SHOW_SCORE"
        });

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
                        enabled={jContent.allow_indicator_browsing}
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