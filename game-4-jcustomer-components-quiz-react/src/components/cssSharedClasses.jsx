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
        //TODO manage transition

        // position: 'absolute',
        // right:'-105%',
        // transform: 'translateX(-100%)',
        // visibility:'hidden',
        // opacity:0,
        display: 'none',
        minHeight:theme.geometry.item.minHeight,//'700px',
        // float: 'left',
        width: '100%',
        // marginRight: '-100%',
        backfaceVisibility: 'hidden',
        // transition:theme.transitions.create(['opacity','visibility'],{
        //     // duration: theme.transitions.duration.long,
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
            // right:0,
            // visibility:'visible',
            // opacity:1,
            // transform: 'translateX(0%)',
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
        flexGrow:2,
        paddingRight:theme.geometry.caption.padding,
        paddingLeft:theme.geometry.caption.padding,
        paddingBottom:theme.geometry.caption.padding,
        zIndex: 10,
        textAlign: 'center',

        ".showResult &": {
            "& button":{
                display:'none',
            }
        }
    },
}));