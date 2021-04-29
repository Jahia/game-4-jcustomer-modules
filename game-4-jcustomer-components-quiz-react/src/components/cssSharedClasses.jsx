import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme)=> ({
    textUppercase: {
        textTransform: "uppercase"
    },
    subtitle: {
        //, &::after
        "&::before":{
            backgroundColor:theme.palette.primary.main,
            display: 'block',
            width:`${theme.spacing(3)}px`,
            height: `${theme.spacing(.25)}px`,
            content:'""',
            margin: "auto",
            marginTop: `${theme.spacing(1)}px`,
        },
    },
    item:{
        // position: 'relative',
        display: 'none',
        minHeight:theme.geometry.item.minHeight,//'700px',
        // float: 'left',
        width: '100%',
        // marginRight: '-100%',
        backfaceVisibility: 'hidden',
        // transition:theme.transitions.create(['transform'],{
        //     duration: theme.transitions.duration.long,
        //     easing: theme.transitions.easing.easeInOut,
        // }),
        "& img":{
            objectFit: 'cover',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1,
        },
        "&.active":{
            // display:'block'
            display:'flex',
            flexWrap:'wrap',
            flexDirection:'column',
        }
    },
    showOverlay:{
        "&::before":{
            position:'absolute',
            top:0, right:0, bottom:0, left:0,
            content:'""',
            backgroundColor: theme.palette.background.overlay,
            // TODO works see better choice
            boxShadow: theme.palette.shadows.overlay,

        }
    },
    caption:{
        // flexBasis:'100%',
        flexGrow:2,
        // position: 'absolute',
        // paddingTop: `${theme.spacing(.5)}px`,
        paddingRight:theme.geometry.caption.padding,
        paddingLeft:theme.geometry.caption.padding,
        paddingBottom:theme.geometry.caption.padding,
        zIndex: 10,
        textAlign: 'center',
        // transition:theme.transitions.create(['paddingTop'],{
        //     duration: theme.transitions.duration.standard,
        //     easing: theme.transitions.easing.header,
        // }),

        ".showResult &": {
            // paddingTop: `${theme.spacing(.75)}px`,
            "& button":{
                display:'none',
            }
        }
    },
}));