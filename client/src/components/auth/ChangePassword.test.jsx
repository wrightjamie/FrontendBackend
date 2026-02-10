/**
 * @file ChangePassword.test.jsx
 * @description Unit tests for the ChangePassword component.
 * 
 * @tests
 * 1. Renders password change form with all inputs.
 * 2. Validates that new passwords match.
 * 3. Validates minimum password length.
 * 4. Validates that new password differs from current.
 * 5. Handles successful password change.
 * 6. Displays error on API failure.
 * 7. Shows success message after password change.
 */
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import ChangePassword from './ChangePassword';
import React from 'react';
import apiClient from '../../api/apiClient';

// Mock the CSS module
vi.mock('./ChangePassword.module.css', () => ({
    default: {
        container: 'container',
        form: 'form',
        error: 'error',
        actions: 'actions',
        submitBtn: 'submitBtn',
        cancelBtn: 'cancelBtn',
        successMessage: 'successMessage',
        successIcon: 'successIcon'
    }
}));

// Mock apiClient
vi.mock('../../api/apiClient');

// Mock Button component
vi.mock('../ui/Button', () => ({
    Button: ({ children, intent, size, flat, grouped, ...props }) => (
        <button {...props}>{children}</button>
    )
}));

// Mock Input component
vi.mock('../ui/form/Input', () => ({
    Input: ({ label, id, name, helperText, error, icon, ...props }) => (
        <div>
            <label htmlFor={id || name}>{label}</label>
            <input id={id || name} name={name} {...props} />
        </div>
    )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    CheckCircle: () => <span>CheckIcon</span>
}));

describe('ChangePassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    const fillPasswordForm = (currentPassword, newPassword, confirmPassword) => {
        fireEvent.change(screen.getByLabelText(/current password/i), {
            target: { value: currentPassword }
        });
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
            target: { value: newPassword }
        });
        fireEvent.change(screen.getByLabelText(/confirm new password/i), {
            target: { value: confirmPassword }
        });
    };

    it('renders password change form with all inputs', () => {
        render(<ChangePassword />);

        expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('validates that new passwords match', async () => {
        render(<ChangePassword />);

        fillPasswordForm('oldpass123', 'newpass123', 'differentpass');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        // Check if the error message is displayed
        expect(await screen.findByText(/^new passwords do not match$/i)).toBeInTheDocument();
        expect(apiClient).not.toHaveBeenCalled();
    });

    it('validates minimum password length', async () => {
        render(<ChangePassword />);

        fillPasswordForm('oldpass123', 'short', 'short');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/must be at least 6 characters/i)).toBeInTheDocument();
        expect(apiClient).not.toHaveBeenCalled();
    });

    it('validates that new password differs from current', async () => {
        render(<ChangePassword />);

        fillPasswordForm('samepass123', 'samepass123', 'samepass123');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/must be different from current password/i)).toBeInTheDocument();
        expect(apiClient).not.toHaveBeenCalled();
    });

    it('handles successful password change', async () => {
        vi.useFakeTimers();
        apiClient.mockResolvedValue({ success: true });
        const onSuccess = vi.fn();

        render(<ChangePassword onSuccess={onSuccess} />);

        fillPasswordForm('oldpass123', 'newpass123', 'newpass123');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        // Advance timers and microtasks
        await vi.runAllTimersAsync();

        expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument();

        // Verify API was called correctly
        expect(apiClient).toHaveBeenCalledWith('/auth/change-password', {
            method: 'POST',
            body: {
                currentPassword: 'oldpass123',
                newPassword: 'newpass123'
            }
        });

        expect(onSuccess).toHaveBeenCalled();
    });

    it('displays error on API failure', async () => {
        apiClient.mockRejectedValueOnce({ message: 'Current password is incorrect' });

        render(<ChangePassword />);

        fillPasswordForm('wrongpass', 'newpass123', 'newpass123');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/current password is incorrect/i)).toBeInTheDocument();
    });

    it('shows success message after password change', async () => {
        apiClient.mockResolvedValueOnce({ success: true });

        render(<ChangePassword />);

        fillPasswordForm('oldpass123', 'newpass123', 'newpass123');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/password changed successfully/i)).toBeInTheDocument();
    });

    it('renders cancel button when onCancel is provided', () => {
        const onCancel = vi.fn();
        render(<ChangePassword onCancel={onCancel} />);

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(onCancel).toHaveBeenCalled();
    });

    it('clears error when user starts typing', async () => {
        render(<ChangePassword />);

        fillPasswordForm('oldpass123', 'short', 'short');

        const submitButton = screen.getByRole('button', { name: /change password/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/must be at least 6 characters/i)).toBeInTheDocument();

        // Type in the current password field
        fireEvent.change(screen.getByLabelText(/current password/i), {
            target: { value: 'newvalue' }
        });

        expect(screen.queryByText(/must be at least 6 characters/i)).not.toBeInTheDocument();
    });
});
