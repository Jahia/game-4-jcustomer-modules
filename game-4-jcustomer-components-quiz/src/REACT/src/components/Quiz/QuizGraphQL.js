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
                consent: property(name:"game4:consentType"){
                    node: refNode {
                        id: uuid
                    }
                }
                children{
                    nodes {
                        id: uuid
                        type: primaryNodeType{
                            value:name
                        }
                    }
                }
            }
        }
    }
`


