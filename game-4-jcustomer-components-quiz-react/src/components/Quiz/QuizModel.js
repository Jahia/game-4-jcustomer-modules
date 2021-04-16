import get from "lodash.get";

export default function(quizData) {
    return{
        //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
        id: get(quizData, "id"),
        type: get(quizData, "type.value"),
        key : get(quizData, "key.value", {}),
        title: get(quizData, "title", ""),
        subtitle: get(quizData, "subtitle.value", ""),
        description: get(quizData, "description.value", ""),
        duration: get(quizData, "duration.value", ""),
        //cover: get(quizData, "cover.node.path", ""),
        media: get(quizData, "media.node", {}),
        consents: get(quizData, "consents.nodes", []).map(node =>{
            return {
                id:get(node,"id"),
                actived:JSON.parse(get(node,"actived.value"))
            }
        }),
        personalizedResult :{
            id:get(quizData, "personalizedResult.node.id", null),
            type:get(quizData, "personalizedResult.node.type.value", null)
        },
        childNodes : get(quizData,"children.nodes",[]).map(node =>{
            return {
                id: get(node, "id"),
                type: get(node, "type.value")
            };
        }),
    }
};