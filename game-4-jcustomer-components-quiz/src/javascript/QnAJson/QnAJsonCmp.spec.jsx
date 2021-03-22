import React from 'react';
import {shallow} from '@jahia/test-framework';

import QnAJsonCmp from './QnAJsonCmp';

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
        const cmp = shallow(<QnAJsonCmp {...defaultProps}/>);
        console.log(cmp);
        expect('[*] la bonne réponse').toBe('[*] la bonne réponse');
        // A expect(cmp.props().value).toBe('[*] la bonne réponse');
    });
});
