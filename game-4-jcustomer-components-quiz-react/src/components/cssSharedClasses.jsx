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
    wait: {
        marginTop:theme.spacing(3)
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

        //Marketo Style override
        "& .mktoForm":{
            margin:'auto',
            color:`${theme.palette.text.primary} !important`,
            "& .mktoAsterix":{
                color:theme.palette.primary.main,
            },
            "& .mktoError":{
                "& .mktoErrorArrow":{
                    background:theme.palette.primary.main,
                    borderColor:theme.palette.primary.dark,
                },
                "& .mktoErrorMsg":{
                    background:theme.palette.primary.main,
                    textShadow : "unset",
                    borderColor:theme.palette.primary.dark,
                    boxShadow: `rgba(0,0,0,0.65) 0 2px 7px, inset ${theme.palette.primary.dark} 0 1px 0px`
                },
            },
            "& .mktoRequiredField":{},
            "& .mktoLabel":{
                fontSize: theme.typography.body1.fontSize,
                fontWeight: "400 !important",
                lineHeight: "1.2rem",
                marginBottom: "5px",
            },
            "& .mktoField":{
                lineHeight: "1.5rem",
                fontSize: theme.typography.body1.fontSize,
                padding: "8px 3px",
                border:0,
                borderRadius:"5px"
            },
            "& .mktoButtonWrap.mktoBluePill":{
                "& .mktoButton":{
                    border:0,
                    background:theme.palette.primary.main,
                    borderRadius:"4px",
                    color:theme.palette.text.secondary,
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    lineHeight: 1.75,
                    padding:"6px 16px",
                    minWidth:"64px",
                    textTransform: "uppercase",
                    boxShadow:"0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
                    textShadow: "unset",
                    fontFamily: theme.typography.fontFamily,
                    "&:hover":{
                        border:0,
                        background:theme.palette.primary.dark,
                        boxShadow:"0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
                    }
                }
            }
        }

    }
}));