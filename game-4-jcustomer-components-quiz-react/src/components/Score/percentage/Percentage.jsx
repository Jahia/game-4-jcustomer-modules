import React from 'react';
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    result:{
        marginTop: `${theme.spacing(4)}px`,
        maxWidth: '500px',
        margin: '32px auto',
        "& .CircularProgressbar":{
            "& .CircularProgressbar":{
                "&-text":{
                    fill: theme.palette.primary.main,
                },
                "&-trail": {
                    stroke: theme.palette.grey[300],
                },
                "&-path": {
                    stroke: theme.palette.primary.main,
                },
            }
        }
    }
}));

const Percentage = (props) => {
    const {score} = props
    const classes = useStyles(props);
    console.debug("*** paint percentage result : ",score);
    return(
            <div className={classes.result}>
                <CircularProgressbar value={score} text={`${score}%`}/>
            </div>
    );
}

Percentage.propTypes={
    score:PropTypes.number.isRequired
}

export default Percentage;