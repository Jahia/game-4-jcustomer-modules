import React,{useState,useEffect} from 'react';
import PropTypes from "prop-types";
import {getRandomString} from "misc/utils";
import {Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Answer = (props) =>{
    // const [checked,toggleChecked] = useState(props.answer.checked);
    // const _ID_ = getRandomString(5,"#aA");

    // useEffect(()=>{
    //     props.answer.checked = checked;
    //     props.handleDisableSubmit();
    // },[checked]);

    // const handleChange= (e) => {
    //     console.log("handleChange : ",e.target.id);
    //     toggleChecked(!checked);
    // }
    return(
        <li className={props.answer.checked?"checked":""}>
            <div className={`result ${props.answer.valid?"valid":""}`}>
                {props.answer.valid &&
                <FontAwesomeIcon icon={['fas','check']}/>
                }
                {!props.answer.valid &&
                <FontAwesomeIcon icon={['fas','times']}/>
                }
            </div>
            <Form.Check
                custom
                type={props.type}
                name={props.name}
                id={props.answer.id}
                label={props.answer.label}
                onChange={props.handleChange}
                checked={props.checked}
            />
        </li>
    );
};
Answer.propTypes={
    answer:PropTypes.object.isRequired,
    name:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    checked:PropTypes.bool.isRequired,
    handleChange:PropTypes.func.isRequired
}

export default Answer;