import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';
import { Input } from '../form/Input';

export const PromptDialog = ({
    title = 'Prompt',
    message,
    defaultValue = '',
    submitText = 'Submit',
    cancelText = 'Cancel',
    intent = 'primary',
    onClose
}) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef(null);

    useEffect(() => {
        // Auto-focus input when modal opens.
        // Slight timeout ensures DOM is ready inside the dialog
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 50);
    }, []);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onClose(value);
    };

    const handleCancel = () => onClose(null);

    const footer = (
        <>
            <Button variant="outline" onClick={handleCancel} type="button">
                {cancelText}
            </Button>
            <Button intent={intent} onClick={handleSubmit} type="button">
                {submitText}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={true}
            onClose={handleCancel}
            title={title}
            footer={footer}
            maxWidth="400px"
        >
            <form onSubmit={handleSubmit} style={{ margin: 0 }}>
                {message && <p style={{ marginTop: 0, marginBottom: 'var(--space-md)' }}>{message}</p>}
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoComplete="off"
                    fullWidth
                />
            </form>
        </Modal>
    );
};
