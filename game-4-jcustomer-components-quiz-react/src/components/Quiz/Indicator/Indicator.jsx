import React from "react";
import {StoreContext} from "contexts";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'clsx';

const useStyles = makeStyles(theme => ({
    indicator: {
        boxSizing: 'content-box',
        flex: '0 1 auto',
        width: theme.geometry.indicator.width,
        height: theme.geometry.indicator.height,
        marginRight: theme.geometry.indicator.spacer,
        marginLeft: theme.geometry.indicator.spacer,
        textIndent: '-999px',

        backgroundColor: theme.palette.common.white,
        backgroundClip: 'padding-box',
        // Use transparent borders to increase the hit area by 10px on top and bottom.
        borderTop: `${theme.geometry.indicator.hitAreaHeight} solid transparent`,
        borderBottom: `${theme.geometry.indicator.hitAreaHeight} solid transparent`,
        opacity: '.5',
        transition:theme.transitions.create(['opacity'],{
            duration: theme.transitions.duration.indicator,
            easing: theme.transitions.easing.ease,
        }),
        ".showResult &": {
            backgroundColor:theme.palette.grey[900],
        },
        "&.clickable":{
            cursor: 'pointer',
        },
        "&.active": {
            opacity: 1
        }
    }
}));

const Indicator = (props) =>{
    const classes = useStyles(props);

    const { state, dispatch } = React.useContext(StoreContext);
    const {currentSlide} = state;
    const {id,enabled} = props;

    const active = currentSlide === id;
    const handleCLick = () =>{
        if(enabled)
            dispatch({
                case:"SHOW_SLIDE",
                payload:{
                    slide:id
                }
            });
    };

    return(
        <li className={classnames(
            classes.indicator,
            (active ? 'active':''),
            (enabled ? 'clickable':'')
        )}
            onClick={handleCLick}>
        </li>
    )
}

Indicator.propTypes={
    id:PropTypes.string.isRequired,
    enabled:PropTypes.bool.isRequired
}

export default Indicator;