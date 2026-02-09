/**
 * @file LoginForm.test.jsx
 * @description Unit tests for the LoginForm component.
 * 
 * @tests
 * 1. Renders login form with username and password inputs.
 * 2. Handles form submission with valid credentials.
 * 3. Displays error message on failed login.
 * 4. Shows loading state during submission.
 * 5. Calls onSuccess callback on successful login.
 * 6. Renders register link.
 */
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import React from 'react';

// Mock the CSS module
vi.mock('./LoginForm.module.css', () => ({
    default: {
        form: 'form',
        error: 'error',
        submitBtn: 'submitBtn',
        footer: 'footer',
        link: 'link'
    }
}));

// Mock AuthContext
const mockLogin = vi.fn();
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

// Mock Button component
vi.mock('../ui/Button', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}));

// Mock Input component
vi.mock('../ui/form/Input', () => ({
    Input: ({ label, id, ...props }) => (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} {...props} />
        </div>
    )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    User: () => <span>UserIcon</span>,
    Lock: () => <span>LockIcon</span>
}));

describe('LoginForm', () => {
    beforeEach(() => {
        mockLogin.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    const renderLoginForm = (props = {}) => {
        return render(
            <BrowserRouter>
                <LoginForm {...props} />
            </BrowserRouter>
        );
    };

    it('renders login form with username and password inputs', () => {
        renderLoginForm();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('handles form submission with valid credentials', async () => {
        mockLogin.mockResolvedValue({ success: true });
        const onSuccess = vi.fn();

        renderLoginForm({ onSuccess });

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    it('displays error message on failed login', async () => {
        mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' });

        renderLoginForm();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    it('shows loading state during submission', async () => {
        mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

        renderLoginForm();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(screen.getByText(/signing in/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText(/sign in/i)).toBeInTheDocument();
        });
    });

    it('renders register link', () => {
        renderLoginForm();
        const registerLink = screen.getByText(/register/i);
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('handles unexpected errors gracefully', async () => {
        mockLogin.mockRejectedValue(new Error('Network error'));

        renderLoginForm();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
        });
    });
});
