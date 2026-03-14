import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
    title: 'UI/Form/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'Accept Terms and Conditions',
        id: 'terms-checkbox',
        name: 'terms',
    },
};

export const Checked = {
    args: {
        label: 'Subscribe to newsletter',
        id: 'newsletter',
        name: 'newsletter',
        checked: true,
    },
};

export const WithHelperText = {
    args: {
        label: 'Enable beta features',
        id: 'beta-features',
        name: 'beta',
        helperText: 'Beta features may be unstable.',
    },
};

export const ErrorState = {
    args: {
        label: 'I agree to the privacy policy',
        id: 'privacy',
        name: 'privacy',
        error: 'You must agree to continue.',
    },
};

export const Disabled = {
    args: {
        label: 'Legacy feature',
        id: 'legacy',
        name: 'legacy',
        disabled: true,
    },
};
