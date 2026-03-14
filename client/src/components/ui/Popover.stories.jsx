import React from 'react';
import { Popover } from './Popover';
import { Button } from './Button';

export default {
    title: 'UI/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    render: (args) => (
        <Popover {...args}>
            <div style={{ padding: '1rem', width: '200px' }}>
                <h4>Popover Content</h4>
                <p>This is the content inside the popover.</p>
            </div>
        </Popover>
    ),
    args: {
        trigger: <Button>Click Me</Button>,
    },
};
