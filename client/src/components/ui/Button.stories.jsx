import { Button } from './Button';

export default {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['solid', 'outline', 'ghost'],
            description: 'The visual style of the button',
        },
        intent: {
            control: 'select',
            options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info'],
            description: 'The semantic intent/color of the button',
        },
        size: {
            control: 'radio',
            options: ['xs', 'sm', 'md', 'lg'],
            description: 'The size of the button',
        },
        flat: {
            control: 'boolean',
            description: 'Disable hover translation/lift',
        },
        grouped: {
            control: 'boolean',
            description: 'For buttons in a group (seamless edges)',
        },
        as: {
            table: { disable: true }
        }
    },
};

export const Primary = {
    args: {
        children: 'Primary Button',
        intent: 'primary',
        variant: 'solid',
        size: 'md',
    },
};

export const Secondary = {
    args: {
        children: 'Secondary Button',
        intent: 'secondary',
        variant: 'outline',
    },
};

export const Danger = {
    args: {
        children: 'Delete Account',
        intent: 'danger',
        variant: 'solid',
    },
};

export const Ghost = {
    args: {
        children: 'Cancel',
        variant: 'ghost',
    },
};

export const Sizes = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button {...args} size="xs">Extra Small</Button>
            <Button {...args} size="sm">Small</Button>
            <Button {...args} size="md">Medium</Button>
            <Button {...args} size="lg">Large</Button>
        </div>
    ),
    args: {
        intent: 'primary',
        variant: 'solid',
    },
};

export const Grouped = {
    render: (args) => (
        <div style={{ display: 'flex' }}>
            <Button {...args} grouped intent="secondary">Prev</Button>
            <Button {...args} grouped intent="secondary">Current</Button>
            <Button {...args} grouped intent="secondary">Next</Button>
        </div>
    ),
    args: {
        variant: 'solid',
    },
};
