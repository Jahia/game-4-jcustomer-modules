import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme)=> ({
    textUppercase: {
        textTransform: "uppercase"
    },
    subtitle: {
        // fontSize: "65%",
        borderLeft: `${theme.spacing(1)}px solid ${theme.palette.primary.main}`,
        paddingLeft: "1rem",
        marginLeft: "1rem"
    },
    item:{
        position: 'relative',
        display: 'none',
        float: 'left',
        width: '100%',
        marginRight: '-100%',
        backfaceVisibility: 'hidden',
        transition:theme.transitions.create(['transform'],{
            duration: theme.transitions.duration.long,
            easing: theme.transitions.easing.easeInOut,
        }),
        "& img":{
            minHeight: theme.geometry.item.minHeight,
            objectFit: 'cover',
        },
        "&.active":{
            display:'block'
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
        position: 'absolute',
        top: '4rem',
        '--percentage':`calc(100% - ${theme.geometry.caption.width})`,
        right: 'calc(var(--percentage) / 2)',
        left: 'calc(var(--percentage) / 2)',
        zIndex: 10,
        // color: theme.palette.common.white,
        textAlign: 'center',
        transition:theme.transitions.create(['top'],{
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.header,
        }),

        ".showResult &": {
            top: '7rem',
            "& button":{
                display:'none',
            }
        }
    },
}));