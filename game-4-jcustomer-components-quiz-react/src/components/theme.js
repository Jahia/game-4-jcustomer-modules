import { createMuiTheme } from '@material-ui/core/styles';
import React from "react";

const theme = createMuiTheme({
    geometry:{
        item:{
            minHeight:"70vh",
        },
        control:{
            width:"5%"
        },
        caption:{
            width:"90%",
        },
        indicator:{
            width:"30px",
            height:"3px",
            hitAreaHeight:"10px",
            spacer:"3px",
        }
    },
    palette: {
        primary:{
            light: "#009bdc",
            main: "#007cb0",
            dark: "#005f87"
        },
        secondary:{
            light: "#f57c30",
            main: "#e57834",
            dark: "#bd5715"
        },
        // text:{
        //     primary:"rgba(255, 255, 255, 0.87)"
        // },
        background:{
            overlay: "rgba(0,0,0,.75)",
        },
        shadows:{
            overlay:"inset 1140px 0 570px -570px rgba(0,0,0,.5)",
        }
    },
    typography:{
        allVariants:{
            color:"rgba(255, 255, 255, 0.87)"
        },
        fontFamily:["Lato","Helvetica","Arial","sans-serif"].join(","),
        h3:{
            fontWeight: 300
        },
        h4:{
            fontWeight: 300
        }
    },
    // shape:{
    //     borderRadius:3
    // }
    transitions:{
        easing:{
            ease:"cubic-bezier(0.25, 0.1, 0.25, 1)",
            header:"cubic-bezier(.23,1,.32,1)"
        },
        duration:{
            long:600
        }
    },
    spacing: 4,
    overrides: {
        MuiCheckbox:{
            root:{
                color:"rgba(255, 255, 255, 0.87)"
            }
        }
        // MuiCssBaseline: {
        //     '@global': {
        //         '@font-face': ['Lato'],
        //     },
        // },
    },
    props:{
        MuiButton:{
            disableRipple:true,
            color:"primary",
            variant:"contained"
        },
        MuiCheckbox:{
            disableRipple:true,
            color:"primary",
        }
    }
});

export default theme;