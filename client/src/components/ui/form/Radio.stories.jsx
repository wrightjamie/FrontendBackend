import React from 'react';
import { Radio } from './Radio';

export default {
    title: 'UI/Form/Radio',
    component: Radio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'Option A',
        id: 'option-a',
        name: 'options',
        value: 'a',
    },
};

export const Checked = {
    args: {
        label: 'Option B',
        id: 'option-b',
        name: 'options',
        value: 'b',
        checked: true,
    },
};

export const WithHelperText = {
    args: {
        label: 'Option C',
        id: 'option-c',
        name: 'options',
        value: 'c',
        helperText: 'This is extra info for option C.',
    },
};

export const ErrorState = {
    args: {
        label: 'Option D',
        id: 'option-d',
        name: 'options',
        value: 'd',
        error: 'Invalid selection.',
    },
};

export const Disabled = {
    args: {
        label: 'Option E',
        id: 'option-e',
        name: 'options',
        value: 'e',
        disabled: true,
    },
};
