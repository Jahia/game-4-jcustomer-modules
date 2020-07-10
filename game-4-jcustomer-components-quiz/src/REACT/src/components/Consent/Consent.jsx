import React from 'react';
import PropTypes from "prop-types";
import {Form} from "react-bootstrap";

const Consent = (props)=> {
    return(
        <Form.Check
            custom
            type="checkbox"
            name={props.qna.id}
            id={props.answer.id}
            label={props.answer.label}
            onChange={props.handleChange}
            checked={props.checked}
        />
    )
}

Consent.propTypes={
    node:PropTypes.object.isRequired
};

export default Consent;