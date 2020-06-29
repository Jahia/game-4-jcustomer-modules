import React, {useContext} from 'react';
import PropTypes from "prop-types";

import get from "lodash.get";
import {JContext} from "contexts";

import Qna from "components/Qna";
import Warmup from "components/Warmup"

const QuizChild = ({childNode,show,childIndex,setChildIndex,max,getFinalScore,quizKey}) => {
    const {cnd_type} =  useContext(JContext);
    
    const node = {
        id: get(childNode, "id", ""),
        type: get(childNode, "type.value", ""),
    };

    return(
        <>
        { node.type == cnd_type.QNA ?
                <Qna
                    id={node.id}
                    show={show}
                    childIndex={childIndex}
                    setChildIndex={setChildIndex}
                    max={max}
                    getFinalScore={getFinalScore}
                    quizKey={quizKey}
                />
        }
        </>
    );
}

QuizChild.propTypes={
    childNode:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    childIndex:PropTypes.number.isRequired,
    setChildIndex:PropTypes.func.isRequired,
    max:PropTypes.number.isRequired,
    getFinalScore:PropTypes.func.isRequired,
    quizKey:PropTypes.string.isRequired
}

export default QuizChild;