import React from 'react';
import Toast from './Toast';
import { ToastProvider } from '../../../context/ToastContext';

export default {
    title: 'UI/Toast',
    component: Toast,
    parameters: {
        layout: 'padded',
    },
    decorators: [
        (Story) => (
            <ToastProvider>
                <Story />
            </ToastProvider>
        ),
    ],
    tags: ['autodocs'],
};

export const Success = {
    args: {
        id: '1',
        message: 'Your profile has been updated.',
        type: 'success',
        onClose: () => console.log('Close clicked'),
    },
};

export const ErrorState = {
    args: {
        id: '2',
        message: 'Failed to save changes. Please try again.',
        type: 'error',
        onClose: () => console.log('Close clicked'),
    },
};

export const Warning = {
    args: {
        id: '3',
        message: 'Your session will expire in 5 minutes.',
        type: 'warning',
        onClose: () => console.log('Close clicked'),
    },
};
