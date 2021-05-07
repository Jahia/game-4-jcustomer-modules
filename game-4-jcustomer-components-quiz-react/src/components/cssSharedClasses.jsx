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
        display: 'none',
        minHeight:theme.geometry.item.minHeight,
        width: '100%',
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

            boxShadow: theme.palette.shadows.overlay.lg,
            [theme.breakpoints.between('xs', 'sm')]: {
                boxShadow: theme.palette.shadows.overlay.xs,
            }
        }
    },
    caption:{
        width:'100%',
        flexGrow:2,
        paddingRight:theme.geometry.caption.padding.lg,
        paddingLeft:theme.geometry.caption.padding.lg,
        paddingBottom:theme.geometry.caption.padding.lg,
        [theme.breakpoints.between('xs', 'sm')]: {
            paddingRight:theme.geometry.caption.padding.xs,
            paddingLeft:theme.geometry.caption.padding.xs,
            paddingBottom:theme.geometry.caption.padding.xs,
        },
        zIndex: 10,
        textAlign: 'center',

        ".showResult &": {
            "& button":{
                display:'none',
            }
        }
    },
    captionMain:{
        [theme.breakpoints.between('xs', 'sm')]: {
            "& h3": {
                fontSize:'2.125rem'
            },
            "& h4": {
                fontSize:'1.875rem'
            },
            paddingRight:theme.geometry.caption.padding.main,
            paddingLeft:theme.geometry.caption.padding.main
        },
        "& .mktoForm":{
            margin:'auto',
            color:`${theme.palette.text.primary} !important`
        }

    }
}));