import React from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';

export const ConfirmDialog = ({
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    intent = 'danger',
    onClose
}) => {
    const handleConfirm = () => onClose(true);
    const handleCancel = () => onClose(false);

    const footer = (
        <>
            <Button variant="outline" onClick={handleCancel}>
                {cancelText}
            </Button>
            <Button intent={intent} onClick={handleConfirm}>
                {confirmText}
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
            <p style={{ margin: 0 }}>{message}</p>
        </Modal>
    );
};
