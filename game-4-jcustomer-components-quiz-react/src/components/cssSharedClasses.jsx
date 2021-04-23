import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme)=> ({
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
}));