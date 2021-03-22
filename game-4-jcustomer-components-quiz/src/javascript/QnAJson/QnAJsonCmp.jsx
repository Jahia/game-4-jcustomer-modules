import React from 'react';
import * as PropTypes from 'prop-types';
import './QnAJsonCmp.css';

const QnAJsonCmp = ({id, value, onChange}) => {
    return (
        <h1 id={id} onClick={onChange}>le code : {value}</h1>
    );
};

QnAJsonCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

QnAJsonCmp.displayName = 'QnAJsonCmp';

export default QnAJsonCmp;
