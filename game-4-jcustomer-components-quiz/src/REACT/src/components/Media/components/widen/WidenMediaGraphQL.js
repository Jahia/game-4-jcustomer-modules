import {gql} from 'apollo-boost';

export const GET_WIDEN_MEDIA = gql`
    query getWidenMedia($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            media: nodeById(uuid: $id) {
                id: uuid
                type: primaryNodeType{
                    value:name
                }
                title:displayName(language:$language)
                imageURL: property(name:"wden:templatedUrl"){
                    value
                }
                videoURL: property(name:"wden:videoStreamURL"){
                    value
                }
            }
        }
    }
`


