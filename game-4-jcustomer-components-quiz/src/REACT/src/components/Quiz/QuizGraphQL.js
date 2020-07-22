import {gql} from 'apollo-boost';

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
                cover: property(name:"game4:cover"){
                    node: refNode {
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
                children{
                    nodes {
                        id: uuid
                        type: primaryNodeType{
                            value:name
                        }
                    }
                },
                btnStart: property(name:"game4:btnStart"){
                    value
                },
                btnSubmit: property(name:"game4:btnSubmit"){
                    value
                },
                btnQuestion: property(name:"game4:btnQuestion"){
                    value
                },
                btnNextQuestion: property(name:"game4:btnNextQuestion"){
                    value
                },
                btnShowResults: property(name:"game4:btnShowResults"){
                    value
                },
                consentTitle: property(name:"game4:consentTitle"){
                    value
                },
                correctAnswer: property(name:"game4:correctAnswer"){
                    value
                },
                wrongAnswer: property(name:"game4:wrongAnswer"){
                    value
                }
            }
        }
    }
`


