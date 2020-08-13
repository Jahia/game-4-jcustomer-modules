import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Answer = (props) =>{
    const {qna, qnaDispatch,answer} = props;

    const isValid = answer.valid || (qna.notUsedForScore ? answer.checked : false);
    const handleChange = () =>
        qnaDispatch({
            case:"TOGGLE_ANSWER",
            payload:{
                answer
            }
        });

    return(
        <li className={answer.checked?"checked":""}>
            <div className={`result ${isValid?"valid":""}`}>
                {isValid &&
                    <FontAwesomeIcon icon={['fas','check']}/>
                }
                {!isValid &&
                    <FontAwesomeIcon icon={['fas','times']}/>
                }
            </div>
            <Form.Check
                custom
                type={qna.inputType}
                name={qna.id}
                id={answer.id}
                label={answer.label}
                onChange={handleChange}
                checked={answer.checked}
            />
        </li>
    );
};

Answer.propTypes={
    qna:PropTypes.object.isRequired,
    qnaDispatch:PropTypes.func.isRequired,
    answer:PropTypes.object.isRequired,
}

export default Answer;