import {gql} from 'apollo-boost';

// const propsFragment = gql`
//     fragment props on JCRNode{
//         id:uuid
//         key: property(language:$language, name:"game4:quizKey"){
//             value
//         }
//         title:displayName(language:$language)
//         subtitle: property(language:$language, name:"game4:subtitle"){
//             value
//         }
//         description:property(language:$language,name:"game4:description"){
//             value
//         }
//         duration:property(language:$language,name:"game4:duration"){
//             value
//         }
//         cover: property(language:$language,name:"game4:cover"){
//             node: refNode {
//                 path
//             }
//         }
//         consent: property(language:$language,name:"game4:consentType"){
//             node: refNode {
//                 uuid
//             }
//         }
//         children{
//             nodes {
//                 id:uuid
//                 type: primaryNodeType{
//                     value:name
//                 }
//             }
//         }
//     }
// `

export const GET_QUIZ = gql`
    query getQuiz($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            quiz: nodeById(uuid: $id) {
                id: uuid
                key: property(name:"game4:quizKey"){
                    value
                }
                title:displayName(language:$language)
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
                        uuid
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
// ${propsFragment}


