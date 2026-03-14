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
            <RadioGroup {...args}>
                <Radio label="Option A" id="radio-a" name="demo-grp" value="a" checked={value === 'a'} onChange={(e) => setValue(e.target.value)} />
                <Radio label="Option B" id="radio-b" name="demo-grp" value="b" checked={value === 'b'} onChange={(e) => setValue(e.target.value)} />
                <Radio label="Option C" id="radio-c" name="demo-grp" value="c" checked={value === 'c'} onChange={(e) => setValue(e.target.value)} />
            </RadioGroup>
        );
    },
    args: {
        label: 'Select an option',
        name: 'demo-grp',
    },
};

export const WithError = {
    render: (args) => (
        <RadioGroup {...args}>
            <Radio label="Apple" id="apple" name="fruit" value="apple" onChange={() => {}} />
            <Radio label="Banana" id="banana" name="fruit" value="banana" onChange={() => {}} />
        </RadioGroup>
    ),
    args: {
        label: 'Favorite Fruit',
        name: 'fruit',
        error: 'Please select a fruit.',
        required: true,
    },
};
