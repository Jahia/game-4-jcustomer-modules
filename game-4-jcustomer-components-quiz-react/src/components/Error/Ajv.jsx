import React from 'react';
import PropTypes from "prop-types";
import get from "lodash.get";

const Ajv = ({item,errors})=> {
    return(
        <div>
            <h1>Validation errors</h1>
            <p>An error occurred when validating <b>{item}</b></p>
            <ul>
                {errors.map( error =>{
                    const additionalProperty = get(error,"params.additionalProperty");
                    return  <li key={`${error.keyword}_${additionalProperty}`}>
                        {error.message}<b>{additionalProperty ? `: ${additionalProperty}`:""}</b>
                    </li>})
                }
            </ul>
        </div>
    )
}

Ajv.propTypes={
    item:PropTypes.string.isRequired,
    errors:PropTypes.array.isRequired
};

export default Ajv;