import React from 'react';
import * as PropTypes from 'prop-types';
import './QnAJsonCmp.css';

import {Input} from '@jahia/design-system-kit';

const defaultAnswer = {
    isAnswer: false,
    label: '',
    cdpValue: ''
};

const formatValue = value => {
    if (value === undefined) {
        return defaultAnswer;
    }

    // The following is for backward compatibility
    const validMark = '[*]';
    const valid = value.indexOf(validMark) === 0;
    if (valid) {
        return {
            ...defaultAnswer,
            isAnswer: true,
            label: value.substring(validMark.length + 1)// +1 is for space between mark and label
        };
    }

    console.log('value :', value);
    try {
        const formattedValue = JSON.parse(value);
        if (typeof formattedValue === 'object' && formattedValue !== null) {
            return formattedValue;
        }
    } catch (e) {
        console.log('value :', value);
        console.error('json parse failed : ', e);
    }

    return {
        ...defaultAnswer,
        label: value
    };
};

const QnAJsonCmp = ({field, id, value, onChange}) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength');

    const controlledValue = formatValue(value);
    const handleChangeLabel = e => {
        controlledValue.label = e?.target?.value;
        onChange(controlledValue);
    };

    const handleChangeCdpValue = e => {
        controlledValue.cdpValue = e?.target?.value;
        onChange(controlledValue);
    };

    return (
        <fieldset name="toto">
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
            <Input
                fullWidth
                id={`cdp-${id}`}
                name={`cdp-${id}`}
                value={controlledValue.cdpValue}
                readOnly={field.readOnly}
                type="text"
                onChange={handleChangeCdpValue}
            />
        </fieldset>
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
