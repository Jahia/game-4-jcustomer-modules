import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import {Button} from "@material-ui/core";
import React from "react";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#009bdc",
            main: "#007cb0",
            dark: "#005f87"
        },
        secondary: {
            light: "#f57c30",
            main: "#e57834",
            dark: "#bd5715"
        },
    },
    typography:{
        fontFamily:'"Lato","Helvetica","Arial",sans-serif',
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
    spacing: 4,
    props:{
        MuiButton:{
            disableRipple:true,
            color:"primary",
            variant:"contained"
        },
        MuiCheckbox:{
            disableRipple:true
        }
    }
});

export default theme;