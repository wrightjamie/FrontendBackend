import React, { useState } from 'react';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';

export default {
    title: 'UI/Form/RadioGroup',
    component: RadioGroup,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export const Default = {
    render: (args) => {
        const [value, setValue] = useState('a');
        return (
            <RadioGroup 
                {...args} 
                value={value} 
                onChange={(val) => setValue(val)} 
            />
        );
    },
    args: {
        label: 'Select an option',
        name: 'demo-grp',
        options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
            { label: 'Option C', value: 'c' }
        ]
    },
};

export const WithError = {
    render: (args) => {
        const [value, setValue] = useState('');
        return (
            <RadioGroup 
                {...args} 
                value={value} 
                onChange={(val) => setValue(val)} 
            />
        );
    },
    args: {
        label: 'Favorite Fruit',
        name: 'fruit',
        error: 'Please select a fruit.',
        required: true,
        options: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' }
        ]
    },
};
