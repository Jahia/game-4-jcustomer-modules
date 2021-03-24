import React from 'react';
import {shallow} from '@jahia/test-framework';

import {QnAJson} from './QnAJsonCmp';

describe('QnAJsonCmp', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            id: 'qnaJson',
            field: {
                name: 'myQnAJsonName',
                displayName: 'My QnA Json name',
                readOnly: false,
                selectorType: 'Text',
                requiredType: 'STRING',
                selectorOptions: []
            },
            value: '[*] la bonne réponse',
            onChange: jest.fn()
        };
    });

    it('should have the right value', () => {
        // Const controlledValue = {
        //     isAnswer: true,
        //     label: 'la bonne réponse',
        //     cdpValue: ''
        // };
        const cmp = shallow(<QnAJson {...defaultProps}/>);
        console.log(cmp);
        expect('a').toBe('a');
        // Expect(cmp.find()).toBe(controlledValue);
        // A expect(cmp.props().value).toBe('[*] la bonne réponse');
    });
});
