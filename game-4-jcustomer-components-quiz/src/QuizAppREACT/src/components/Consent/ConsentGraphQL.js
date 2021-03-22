import {gql} from 'apollo-boost';

export const GET_CONSENT = gql`
    query getConsent($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            consent: nodeById(uuid: $id) {
                id: uuid
                identifier:name
                title:displayName(language:$language)
                description: property(language:$language, name:"jcr:description"){
                    value
                }
                actived: property(language:$language,name:"wem:activated"){
                    value
                }
            }
        }
    }
`


