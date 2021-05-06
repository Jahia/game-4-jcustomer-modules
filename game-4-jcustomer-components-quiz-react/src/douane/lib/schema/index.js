// import jCustomer from "./definitions/jCustomer";
// import jContent from "./definitions/jContent";
// import gql from "./definitions/gql";
import {workspace} from "douane/lib/config";

export default{
    context:{
        title:"context validation schema ",
        description:"context is an object provided by the page in charge to load the app",
        // definitions: {
        //     jContent:jContent,
        //     jCustomer:jCustomer,
        //     gql:gql
        // },
        type:"object",
        // properties:{
        //     jContent:{$ref:"#jContent"},
        //     gql:{$ref:"#gql"},
        //     jCustomer:{$ref:"#jCustomer"}
        // },
        properties:{
            host:{
                type:"string",
                format:"uri",
                default:process.env.REACT_APP_JCONTENT_HOST || "http://localhost:8080"
            },
            workspace:{
                type:"string",
                enum:workspace,
                default:process.env.REACT_APP_JCONTENT_WORKSPACE || workspace[1]//"live"
            },
            scope:{ type:"string",pattern:"[a-zA-Z0-9-_]+"},//iso
            files_endpoint:{
                type:"string",
                format:"uri",
                default:process.env.REACT_APP_JCONTENT_FILES_ENDPOINT || "http://localhost:8080/files/live"
            },
            gql_endpoint:{
                type:"string",
                format:"uri",
                default:process.env.REACT_APP_JCONTENT_GQL_ENDPOINT || "http://localhost:8080/modules/graphql"
            },
            gql_authorization:{
                type:"string",
                // default:process.env.REACT_APP_JCONTENT_GQL_AUTH || "Basic cm9vdDpyb290"
            },
            gql_variables:{
                type:"object",
                properties:{
                    id:{type:"string"},//"3ff7b68c-1cfa-4d50-8377-03f19db3a985"
                    language:{type:"string",pattern:"[a-z]{2}(?:_[A-Z]{2})?"}//"fr" or "fr_FR"
                },
                required: ["id", "language"]
            },
            cdp_endpoint:{
                type:"string",
                format:"uri",
                default:process.env.REACT_APP_JCUSTOMER_ENDPOINT //could be null in case of edit!
            },
            // transition:{
            //     type:"boolean",
            //     default:false
            // },
            // reset:{
            //     type:"boolean",
            //     default:false
            // },
            // allow_indicator_browsing:{
            //     type:"boolean",
            //     default:false
            // },
            // theme:{
            //     type:"object",
            // },
            // language_bundle:{
            //     type:"object",
            //     properties:{
            //         btnStart:{type:"string"},//"Démarrer",
            //         btnSubmit:{type:"string"},//"Soumettre",
            //         btnQuestion:{type:"string"},//"Question",
            //         btnNextQuestion:{type:"string"},//"Question suivante",
            //         btnShowResults:{type:"string"},//"Mon score",
            //         consentTitle:{type:"string"},//"Consentement",
            //         correctAnswer:{type:"string"},//"Correcte",
            //         wrongAnswer:{type:"string"}//"Incorrecte"
            //     },
            //     required: [
            //         "btnStart",
            //         "btnSubmit",
            //         "btnQuestion",
            //         "btnNextQuestion",
            //         "btnShowResults",
            //         "consentTitle",
            //         "correctAnswer",
            //         "wrongAnswer"
            //     ],
            //     additionalProperties:false
            // }
        },
        required: [
            "host",
            // "allow_indicator_browsing",
            "workspace",
            "scope",
            "files_endpoint",
            "gql_endpoint",
            // "gql_authorization",
            "gql_variables",
            "cdp_endpoint",
            // "language_bundle"
        ],
        additionalProperties:false
    }
}