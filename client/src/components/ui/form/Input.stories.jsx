import { Input } from './Input';
import { Search, Mail } from 'lucide-react';

export default {
    title: 'UI/Form/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number'],
        },
    },
};

export const Default = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        type: 'text',
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Input {...args} />
        </div>
    )
};

export const WithHelperText = {
    args: {
        label: 'Password',
        type: 'password',
        helperText: 'Must be at least 8 characters long.',
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Input {...args} />
        </div>
    )
};

export const WithError = {
    args: {
        label: 'Email Address',
        type: 'email',
        defaultValue: 'invalid-email',
        error: 'Please enter a valid email address.',
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Input {...args} />
        </div>
    )
};

export const WithIcon = {
    args: {
        label: 'Search',
        placeholder: 'Search for anything...',
        type: 'text',
        icon: Search
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Input {...args} />
        </div>
    )
};
