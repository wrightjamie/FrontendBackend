import { Select } from './Select';

export default {
    title: 'UI/Form/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        error: { control: 'text' },
        helperText: { control: 'text' }
    },
};

const sampleOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
];

export const Default = {
    args: {
        label: 'Favorite Fruit',
        placeholder: 'Choose a fruit...',
        options: sampleOptions,
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Select {...args} />
        </div>
    )
};

export const WithHelperText = {
    args: {
        label: 'Role',
        options: ['Admin', 'Editor', 'Viewer'],
        helperText: 'Select the user\'s primary role.',
        defaultValue: 'Editor'
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Select {...args} />
        </div>
    )
};

export const WithError = {
    args: {
        label: 'Country',
        options: ['USA', 'Canada', 'Mexico'],
        placeholder: 'Select a country',
        error: 'This field is required.',
    },
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Select {...args} />
        </div>
    )
};
