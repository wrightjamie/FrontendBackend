import React from 'react';
import { ModalProvider, useModal } from '../../../context/ModalContext';
import { Button } from '../Button';

export default {
    title: 'UI/Modal',
    decorators: [
        (Story) => (
            <ModalProvider>
                <div style={{ padding: '2rem', minHeight: '300px', background: 'var(--bg-main)' }}>
                    <Story />
                </div>
            </ModalProvider>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

const DemoComponent = () => {
    const { confirm, prompt } = useModal();
    const [result, setResult] = React.useState('');

    const handleConfirm = async () => {
        const confirmed = await confirm({
            title: 'Delete Item',
            message: 'Are you sure you want to delete this? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            intent: 'danger'
        });
        setResult(confirmed ? 'Confirmed deletion' : 'Cancelled deletion');
    };

    const handlePrompt = async () => {
        const value = await prompt({
            title: 'New Folder Name',
            message: 'Enter a name for the new folder:',
            defaultValue: 'Untitled Folder',
            submitText: 'Create',
            cancelText: 'Cancel',
            intent: 'primary'
        });
        setResult(value !== null ? `Submitted: ${value}` : 'Cancelled prompt');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={handleConfirm} intent="danger">Trigger Confirm</Button>
                <Button onClick={handlePrompt} intent="primary">Trigger Prompt</Button>
            </div>
            {result && (
                <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <strong>Last Result: </strong> {result}
                </div>
            )}
        </div>
    );
};

export const Interactive = {
    render: () => <DemoComponent />
};
