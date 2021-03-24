import React from 'react';
import * as PropTypes from 'prop-types';
import './QnAJsonCmp.css';

// Import {Input} from '@jahia/design-system-kit';

// Import Checkbox from '@material-ui/core/Checkbox';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
// import TextField from '@material-ui/core/TextField';
import {Checkbox, FormGroup, FormControlLabel, FormControl, FormLabel, TextField, withStyles} from '@material-ui/core';

const styles = theme => ({
    root: {
        '& > *': {
            margin: Number(theme.spacing.unit),
            width: '25ch'
        }
    },
    input: {
        flex: '100%',
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        height: '50px'
    }
});

const defaultAnswer = {
    isAnswer: false,
    label: '',
    cdpValue: ''
};

const formatValue = value => {
    console.log('value :', value);
    console.log('typeof value :', typeof value);

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

    console.log('will return default');
    // Try {
    //     const formattedValue = JSON.parse(value);
    //     if (typeof formattedValue === 'object' && formattedValue !== null) {
    //         return formattedValue;
    //     }
    // } catch (e) {
    //     console.log('value :', value);
    //     console.error('json parse failed : ', e);
    // }

    return {
        ...defaultAnswer,
        label: value
    };
};

const QnAJsonCmp = ({field, id, value, onChange, classes}) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength');

    const controlledValue = formatValue(value);
    const handleChangeLabel = e => {
        controlledValue.label = e?.target?.value;
        onChange(controlledValue);
    };
    //
    // const handleChangeCdpValue = e => {
    //     controlledValue.cdpValue = e?.target?.value;
    //     onChange(controlledValue);
    // };

    return (
        <FormControl className={classes.root} component="fieldset">
            <FormLabel component="legend">Answer 1</FormLabel>
            <FormGroup row aria-label="position">
                <FormControlLabel
                    value="start"
                    control={<Checkbox color="primary"/>}
                    label="is Answer"
                    labelPlacement="start"
                />
                <TextField id={`cdp-${id}`} label="CDP value to store" maxLength={maxLength} onChange={handleChangeLabel}/>
                <TextField id={id} label="Answer"/>
            </FormGroup>
        </FormControl>
    );

    // Return (
    //     <fieldset name="toto">
    //         <FormControlLabel
    //             value="start"
    //             control={<Checkbox color="primary"/>}
    //             label="Start"
    //             labelPlacement="start"
    //         />
    //
    //         <Input
    //             id={id}
    //             name={id}
    //             inputProps={{
    //                 'aria-labelledby': `${field.name}-label`,
    //                 'aria-required': field.mandatory,
    //                 maxlength: maxLength && maxLength.value
    //             }}
    //             value={controlledValue.label}
    //             readOnly={field.readOnly}
    //             type="text"
    //             onChange={handleChangeLabel}
    //         />
    //         <Input
    //             fullWidth
    //             id={`cdp-${id}`}
    //             name={`cdp-${id}`}
    //             value={controlledValue.cdpValue}
    //             readOnly={field.readOnly}
    //             type="text"
    //             onChange={handleChangeCdpValue}
    //         />
    //
    //     </fieldset>
    // );
};

QnAJsonCmp.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export const QnAJson = withStyles(styles)(QnAJsonCmp);
QnAJsonCmp.displayName = 'QnAJsonCmp';
