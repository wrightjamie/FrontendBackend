/**
 * @file ToastContainer.test.jsx
 * @description Unit tests for the ToastContainer component.
 * 
 * @tests
 * 1. Renders empty container when no toasts.
 * 2. Renders multiple toasts.
 * 3. Passes correct props to Toast components.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ToastContainer from './ToastContainer';
import React from 'react';

// Mock the CSS module
vi.mock('./Toast.module.css', () => ({
    default: {
        toastContainer: 'toastContainer'
    }
}));

// Mock ToastContext
let mockToasts = [];
vi.mock('../../../context/ToastContext', () => ({
    useToast: () => ({
        toasts: mockToasts
    })
}));

// Mock Toast component
vi.mock('./Toast', () => ({
    default: ({ id, message, type }) => (
        <div data-testid={`toast-${id}`}>
            {message} - {type}
        </div>
    )
}));

describe('ToastContainer', () => {
    afterEach(() => {
        cleanup();
        mockToasts = [];
    });

    it('renders empty container when no toasts', () => {
        mockToasts = [];
        const { container } = render(<ToastContainer />);

        const toastContainer = container.querySelector('.toastContainer');
        expect(toastContainer).toBeInTheDocument();
        expect(toastContainer.children).toHaveLength(0);
    });

    it('renders single toast', () => {
        mockToasts = [
            { id: '1', message: 'Test toast', type: 'success' }
        ];
        render(<ToastContainer />);

        expect(screen.getByTestId('toast-1')).toBeInTheDocument();
        expect(screen.getByText(/test toast - success/i)).toBeInTheDocument();
    });

    it('renders multiple toasts', () => {
        mockToasts = [
            { id: '1', message: 'First toast', type: 'success' },
            { id: '2', message: 'Second toast', type: 'error' },
            { id: '3', message: 'Third toast', type: 'info' }
        ];
        render(<ToastContainer />);

        expect(screen.getByTestId('toast-1')).toBeInTheDocument();
        expect(screen.getByTestId('toast-2')).toBeInTheDocument();
        expect(screen.getByTestId('toast-3')).toBeInTheDocument();
        expect(screen.getByText(/first toast - success/i)).toBeInTheDocument();
        expect(screen.getByText(/second toast - error/i)).toBeInTheDocument();
        expect(screen.getByText(/third toast - info/i)).toBeInTheDocument();
    });

    it('passes correct props to Toast components', () => {
        mockToasts = [
            { id: 'test-id', message: 'Test message', type: 'warning' }
        ];
        render(<ToastContainer />);

        expect(screen.getByTestId('toast-test-id')).toBeInTheDocument();
        expect(screen.getByText(/test message - warning/i)).toBeInTheDocument();
    });
});
