import {gql} from 'apollo-boost';

// cover: property(name:"game4:cover"){
//     node: refNode {
//         path
//     }
// }

export const GET_QUIZ = gql`
    query getQuiz($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            quiz: nodeById(uuid: $id) {
                id: uuid
                type: primaryNodeType{
                    value:name
                }
                key: property(name:"game4:quizKey"){
                    value
                }
                title: displayName(language:$language)
                subtitle: property(language:$language, name:"game4:subtitle"){
                    value
                }
                description: property(language:$language,name:"game4:description"){
                    value
                }
                duration: property(name:"game4:duration"){
                    value
                }
                media: property(language:$language,name:"wden:mediaNode",){
                    node: refNode {
                        id: uuid
                        type: primaryNodeType{
                            value:name
                        }
                        mixins: mixinTypes{
                            value:name
                        }
                        path
                    }
                }
                consents: property(name:"game4:consentType"){
                    nodes: refNodes {
                        id: uuid
                        actived: property(language:$language,name:"wem:activated"){
                            value
                        }
                    }
                }
                personalizedResult: property(name:"game4:personalizedResultContent"){
                    node: refNode {
                        id: uuid
                        type: primaryNodeType{
                            value:name
                        }
                    }
                }
                children{
                    nodes {
                        id: uuid
                        type: primaryNodeType{
                            value:name
                        }
                    }
                },
                btnStart: property(language:$language, name:"game4:btnStart"){
                    value
                },
                btnSubmit: property(language:$language, name:"game4:btnSubmit"){
                    value
                },
                btnQuestion: property(language:$language, name:"game4:btnQuestion"){
                    value
                },
                btnNextQuestion: property(language:$language, name:"game4:btnNextQuestion"){
                    value
                },
                btnShowResults: property(language:$language, name:"game4:btnShowResults"){
                    value
                },
                btnReset: property(language:$language, name:"game4:btnReset"){
                    value
                },
                consentTitle: property(language:$language, name:"game4:consentTitle"){
                    value
                },
                correctAnswer: property(language:$language, name:"game4:correctAnswer"){
                    value
                },
                wrongAnswer: property(language:$language, name:"game4:wrongAnswer"){
                    value
                }
            }
        }
    }
`


