import React from 'react';
import * as PropTypes from 'prop-types';
import './QnAJsonCmp.css';

import {Input} from '@jahia/design-system-kit';

const QnAJsonCmp = ({field, id, value, onChange}) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength');
    //TODO create JSON and migration of existing '[*] fffff'
    const controlledValue = value === undefined ? {} : JSON.parse(value)
    const handleChangeLabel = (e) => {
        controlledValue.label = e?.target?.value;
        onChange(controlledValue);
    }
    return (
        <Input
            fullWidth
            id={id}
            name={id}
            inputProps={{
                'aria-labelledby': `${field.name}-label`,
                'aria-required': field.mandatory,
                maxlength: maxLength && maxLength.value
            }}
            value={controlledValue.label}
            readOnly={field.readOnly}
            type="text"
            onChange={handleChangeLabel}
        />
    );
};

QnAJsonCmp.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

QnAJsonCmp.displayName = 'QnAJsonCmp';

export default QnAJsonCmp;
