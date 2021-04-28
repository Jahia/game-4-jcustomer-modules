import { createMuiTheme } from '@material-ui/core/styles';
import React from "react";
//TODO faire une fonction qui prend un params theme et
// qui retourne le theme pour pouvoir dynamiquement charger le theme depuis jahia
const theme = createMuiTheme({
    geometry:{
        item:{
            minHeight:"70vh",
        },
        // control:{
        //     width:"30px",
        // },
        caption:{
            padding:"60px",
            width:"calc(100% - 120px)",//"90%",
        },
        indicator:{
            width:"30px",
            height:"3px",
            hitAreaHeight:"10px",
            spacer:"3px",
        },
        checkedAnswer:{
            borderRadius:"10px"
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
        text:{
            primary:"rgba(255, 255, 255, 0.87)",
            secondary:"rgba(0, 0, 0, 0.87)"
        },
        background:{
            overlay: "rgba(0,0,0,.75)",
            checkedAnswer: "rgba(255,255,255,1)",
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
        },
        body1:{
            fontSize:"1.1rem",
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
    spacing: 8,
    overrides: {
        MuiCheckbox:{
            root:{
                color:"rgba(255, 255, 255, 0.87)"
            }
        },
        MuiRadio:{
            root:{
                color:"rgba(255, 255, 255, 0.87)"
            }
        },
        MuiButton:{
            contained:{
                "&$disabled": {
                    color: "rgba(255, 255, 255, 0.26)",
                    backgroundColor: "rgba(255, 255, 255, 0.12)"
                }
            }

        },
        MuiTypography:{
            body1:{
                "& a":{
                    color:"#007cb0",
                }
            }
        },
        // MuiCssBaseline: {
        //     '@global': {
        //         // '@font-face': ['Lato'],
        //         '.Mui-disabled': {
        //             color: "rgba(255, 255, 255, 0.26)",
        //             backgroundColor: "rgba(255, 255, 255, 0.12)"
        //         }
        //
        //     },
        // },
    },
    props:{
        MuiButton:{
            disableRipple:true,
            color:"primary",
            variant:"contained",
        },

        MuiCheckbox:{
            disableRipple:true,
            color:"primary",
        },
        MuiRadio:{
            disableRipple:true,
            color:"primary",
        }
    }
});

export default theme;