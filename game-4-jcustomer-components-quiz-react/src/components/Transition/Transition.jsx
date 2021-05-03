import {makeStyles} from "@material-ui/core/styles";
import classnames from "clsx";
import React from "react";
import {StoreContext} from "contexts";
import {Typography} from "@material-ui/core";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const childTiles = (transitionRow) =>{
    const nb = transitionRow.length;
    const reducer =transitionRow.reduce((obj,item,i) =>{
        const index = i+1;
        const key = `&:nth-child(${index})`;
        obj[key]={
            top: `calc(${(index-1)} * ${100/nb}%)`,
            transitionDelay: `${(index-1)*0.1}s`
        }
        return obj;
    },{})
    return reducer;
};

const Transition = (props) => {


    const { state } = React.useContext(StoreContext);
    const {
        transitionActive,
        transitionRow
    } = state;

    const useStyles = makeStyles(theme => ({
        loader: {
            position: 'absolute',
            zIndex: '999',
            top: 0,
            left: 0,
            bottom:0,
            width: 0,
            transition: 'width 0s 1.4s ease',
            "&.active":{
                width: '100%',
                transitionDelay: '0s',
            }
        },
        icon: {
            position: 'absolute',
            zIndex: 1,
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: 0,
            transition: 'opacity .5s ease',

            "& svg":{
                transformOrigin: '0 0',
            },

            ".active &":{
                opacity: 1,
                // transition: 'opacity .5s 1.4s ease',
            },
        },
        tile: {
            position: 'absolute',
            left: 0,
            width: 0,
            height: `${100/transitionRow.length}%`,
            backgroundColor: theme.palette.primary.main,
            transition: 'width .3s ease',
            ...childTiles(transitionRow),

            ".active &":{
                width: '100%',
            }
        }
    }));
    const classes = useStyles(props);

    return (
        <div className={classnames(
            classes.loader,
            (transitionActive?'active':'')
        )}>
            <div className={classes.icon}>
                <Typography variant="h4">
                    {/*<PowerSettingsNewIcon/>*/}
                    JAHIA
                </Typography>
            {/*    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"*/}
            {/*         xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px"*/}
            {/*         viewBox="0 0 40 40" enableBackground="new 0 0 40 40" xmlSpace="preserve">*/}
            {/*        <path opacity="0.2" fill="#000"*/}
            {/*d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path>*/}
            {/*        <path fill="#000"*/}
            {/*              d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"></path>*/}
            {/*        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20"*/}
            {/*                          to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform>*/}
            {/*    </svg>*/}
            </div>
            {transitionRow.map(row=><div className={classes.tile}></div>)}
        </div>
    )
};
export default Transition;