import {gql} from 'apollo-boost';

export const GET_PERSONALIZED_RESULT = gql`
    query getPersonalizedResultContent($workspace: Workspace!, $id: String!, $language: String!,$profileId: String,$sessionId: String) {
        response: jcr(workspace: $workspace) {
            result: nodeById(uuid: $id) {
                jExperience: jExperience(profileId: $profileId, sessionId: $sessionId) {
                    variant:personalizedVariant{
                        id: uuid
                        title:displayName(language:$language)
                        text:property(language:$language,name:"text"){
                            value
                        }
                    }
                }
            }
        }
    }
`


