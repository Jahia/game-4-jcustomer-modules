import React, {useContext} from 'react';
import PropTypes from "prop-types";

import get from "lodash.get";
import {JContext} from "contexts";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Qna from "components/Qna";
import Warmup from "components/Warmup";

// import Answer from "components/Answer";
// import Warmup from "components/Warmup/Warmup"

const QuizChild = ({node,show,quizKey,setShowResult,addItem2Slides,index}) => {
    const {cnd_type} =  useContext(JContext);
    return(
        <>
        { node.type === cnd_type.QNA &&
            <Qna
                id={node.id}
                show={show}
                quizKey={quizKey}
                setShowResult={setShowResult}
            />
        }
        { node.type === cnd_type.WARMUP &&
            <Warmup
                id={node.id}
                show={show}
                quizKey={quizKey}
                setShowResult={setShowResult}
                addItem2Slides={addItem2Slides}
                index={index}
            />
        }
        </>
    );
}

QuizChild.propTypes={
    node:PropTypes.object.isRequired,
    show:PropTypes.bool.isRequired,
    quizKey:PropTypes.string.isRequired,
    setShowResult:PropTypes.func.isRequired,
    addItem2Slides:PropTypes.func.isRequired,
    index:PropTypes.string.isRequired
}

export default QuizChild;