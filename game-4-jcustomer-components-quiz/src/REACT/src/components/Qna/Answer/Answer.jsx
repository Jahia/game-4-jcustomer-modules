import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Answer = (props) =>{
    // const [checked,toggleChecked] = useState(props.answer.checked);
    // const _ID_ = getRandomString(5,"#aA");

    const isValid = props.answer.valid || (props.qna.notUsedForScore ? props.answer.checked : false);
    return(
        <li className={props.answer.checked?"checked":""}>
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
                type={props.qna.computedNbExpectedAnswer >1 ?"checkbox":"radio"}
                name={props.qna.id}
                id={props.answer.id}
                label={props.answer.label}
                onChange={props.handleChange}
                checked={props.checked}
            />
        </li>
    );
};
Answer.propTypes={
    qna:PropTypes.object.isRequired,
    answer:PropTypes.object.isRequired,
    checked:PropTypes.bool.isRequired,
    handleChange:PropTypes.func.isRequired
}

export default Answer;