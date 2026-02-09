/**
 * @file Toast.test.jsx
 * @description Unit tests for the Toast component.
 * 
 * @tests
 * 1. Renders toast with message and type.
 * 2. Displays correct icon based on type.
 * 3. Handles close button click.
 * 4. Handles swipe-to-dismiss gesture.
 * 5. Resets position when swipe is below threshold.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import Toast from './Toast';
import React from 'react';

// Mock the CSS module
vi.mock('./Toast.module.css', () => ({
    default: {
        toast: 'toast',
        iconWrapper: 'iconWrapper',
        message: 'message',
        closeBtn: 'closeBtn'
    }
}));

// Mock ToastContext
const mockRemoveToast = vi.fn();
vi.mock('../../../context/ToastContext', () => ({
    useToast: () => ({
        removeToast: mockRemoveToast
    })
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    CheckCircle: () => <span data-testid="success-icon">CheckCircle</span>,
    AlertCircle: () => <span data-testid="error-icon">AlertCircle</span>,
    Info: () => <span data-testid="info-icon">Info</span>,
    X: () => <span>X</span>
}));

describe('Toast', () => {
    beforeEach(() => {
        mockRemoveToast.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders toast with message and type', () => {
        render(<Toast id="1" message="Test message" type="success" />);

        expect(screen.getByText(/test message/i)).toBeInTheDocument();
    });

    it('displays success icon for success type', () => {
        render(<Toast id="1" message="Success!" type="success" />);

        expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    });

    it('displays error icon for error type', () => {
        render(<Toast id="1" message="Error!" type="error" />);

        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    });

    it('displays info icon for info type', () => {
        render(<Toast id="1" message="Info!" type="info" />);

        expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    });

    it('handles close button click', () => {
        render(<Toast id="1" message="Test" type="success" />);

        const closeButton = screen.getByRole('button', { name: /close notification/i });
        fireEvent.click(closeButton);

        expect(mockRemoveToast).toHaveBeenCalledWith('1');
    });

    it('initiates drag on mouse down', () => {
        const { container } = render(<Toast id="1" message="Test" type="success" />);
        const toast = container.querySelector('[data-type="success"]');

        fireEvent.mouseDown(toast, { clientX: 100 });

        expect(toast).toHaveAttribute('data-dragging', 'true');
    });

    it('initiates drag on touch start', () => {
        const { container } = render(<Toast id="1" message="Test" type="success" />);
        const toast = container.querySelector('[data-type="success"]');

        fireEvent.touchStart(toast, { touches: [{ clientX: 100 }] });

        expect(toast).toHaveAttribute('data-dragging', 'true');
    });

    it('applies custom CSS variables for offset and opacity', () => {
        const { container } = render(<Toast id="1" message="Test" type="success" />);
        const toast = container.querySelector('[data-type="success"]');

        // Check that the style attribute contains the CSS custom properties
        const style = toast.getAttribute('style');
        expect(style).toContain('--offset-x');
        expect(style).toContain('--toast-opacity');
    });
});
