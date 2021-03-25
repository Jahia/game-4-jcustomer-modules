import get from "lodash.get";
import {getRandomString} from "misc/utils";

export default function(qnaData){
    const randomSelection=JSON.parse(get(qnaData, "randomSelection.value", false));
    const answers= get(qnaData, "answers.values", []).map(answer=>{
        const controlledAnswer = JSON.parse(answer);
        return {
            ...controlledAnswer,
            id:getRandomString(5,"#aA"),
            checked:false
        }

        // const id = getRandomString(5,"#aA");
        // const valid = answer.indexOf(quiz_validMark) === 0;
        // if(valid)
        //     answer = answer.substring(quiz_validMark.length+1);//+1 is for space between mark and label

        // return {id,label:answer,checked:false,valid}
    })

    if(randomSelection)
        answers.sort( (a,b) => a.id > b.id );

    const inputType = answers.filter(answer => answer.isAnswer).length > 1 ?"checkbox":"radio"

    return {
        id: get(qnaData, "id"),
        title: get(qnaData, "title"),
        question: get(qnaData, "question.value", ""),
        help: get(qnaData, "help.value", ""),
        notUsedForScore: JSON.parse(get(qnaData, "notUsedForScore.value", false)),
        // cover: get(qnaData, "cover.node.path", ""),
        media: get(qnaData, "media.node", {}),
        jExpField2Map: get(qnaData, "jExpField2Map.value", ""),
        randomSelection,
        answers,
        inputType
    }
}