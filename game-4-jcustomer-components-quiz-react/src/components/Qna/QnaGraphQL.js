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

export const GET_QNA = gql`
    query getQna($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            qna: nodeById(uuid: $id) {
                id: uuid
                title:displayName(language:$language)
                question: property(language:$language, name:"game4:question"){
                    value
                }
                help: property(language:$language,name:"game4:help"){
                    value
                }
                nbExpectedAnswer: property(name:"game4:nbExpectedAnswer"){
                    value
                }
                answers: property(language:$language,name:"game4:answers"){
                    values
                }
                randomSelection: property(name:"game4:randomSelection"){
                    value
                }
                notUsedForScore: property(name:"game4:notUsedForScore"){
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
                jExpField2Map: property(name:"game4:jExpProperty"){
                    value
                }

            }
        }
    }
`
// ${propsFragment}


