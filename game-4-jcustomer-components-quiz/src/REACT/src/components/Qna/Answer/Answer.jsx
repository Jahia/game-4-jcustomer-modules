import React,{useState,useEffect} from 'react';
import PropTypes from "prop-types";
import {getRandomString} from "misc/utils";
import {Form} from "react-bootstrap";


const Answer = ({answer,handleDisableSubmit}) =>{
    const [checked,toggleChecked] = useState(answer.checked);
    const _ID_ = getRandomString(5,"#aA");

    useEffect(()=>{
        answer.checked = checked;//Call reduce store ?
        handleDisableSubmit();
    },[checked]);//,[checked]

    const handleChange= () => {
        // console.log("handleChange !")
        toggleChecked(!checked);
    }
    return(
        <Form.Check
            custom
            type="checkbox"
            id={_ID_}
            label={answer.label}
            onChange={handleChange}
            checked={checked}
        />

    );
};
Answer.propTypes={
    answer:PropTypes.object.isRequired,
    handleDisableSubmit:PropTypes.func.isRequired
}

export default Answer;