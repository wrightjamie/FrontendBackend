/**
 * @file LoginModal.test.jsx
 * @description Unit tests for the LoginModal component.
 * 
 * @tests
 * 1. Renders login form when user is not logged in.
 * 2. Renders user menu when user is logged in.
 * 3. Shows admin dashboard link for admin users.
 * 4. Does not show admin dashboard link for non-admin users.
 * 5. Handles logout correctly.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginModal from './LoginModal';
import React from 'react';

// Mock the CSS module
vi.mock('./LoginModal.module.css', () => ({
    default: {
        popover: 'popover',
        form: 'form',
        profileLink: 'profileLink',
        logoutLink: 'logoutLink'
    }
}));

// Mock AuthContext
const mockLogout = vi.fn();
let mockUser = null;

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        logout: mockLogout
    })
}));

// Mock LoginForm component
vi.mock('./LoginForm', () => ({
    default: ({ onSuccess }) => (
        <div data-testid="login-form">
            <button onClick={onSuccess}>Mock Login</button>
        </div>
    )
}));

// Mock Button component
vi.mock('../ui/Button', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}));

// Mock Popover component
vi.mock('../ui/Popover', () => ({
    Popover: ({ children, id, className }) => (
        <div id={id} className={className} data-testid="popover">
            {children}
        </div>
    )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    LayoutDashboard: () => <span>DashboardIcon</span>,
    User: () => <span>UserIcon</span>,
    LogOut: () => <span>LogOutIcon</span>
}));

describe('LoginModal', () => {
    beforeEach(() => {
        mockLogout.mockClear();
        mockUser = null;
        // Mock hidePopover
        document.getElementById = vi.fn(() => ({
            hidePopover: vi.fn()
        }));
    });

    afterEach(() => {
        cleanup();
    });

    const renderLoginModal = () => {
        return render(
            <BrowserRouter>
                <LoginModal />
            </BrowserRouter>
        );
    };

    it('renders login form when user is not logged in', () => {
        mockUser = null;
        renderLoginModal();

        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('renders user menu when user is logged in', () => {
        mockUser = { username: 'testuser', role: 'user' };
        renderLoginModal();

        expect(screen.getByText(/hello, testuser/i)).toBeInTheDocument();
        expect(screen.getByText(/my profile/i)).toBeInTheDocument();
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it('shows admin dashboard link for admin users', () => {
        mockUser = { username: 'admin', role: 'admin' };
        renderLoginModal();

        expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    });

    it('does not show admin dashboard link for non-admin users', () => {
        mockUser = { username: 'testuser', role: 'user' };
        renderLoginModal();

        expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
    });

    it('handles logout correctly', async () => {
        mockUser = { username: 'testuser', role: 'user' };
        renderLoginModal();

        const logoutButton = screen.getByText(/logout/i).closest('div');
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
    });

    it('displays default username when username is missing', () => {
        mockUser = { role: 'user' };
        renderLoginModal();

        expect(screen.getByText(/hello, user/i)).toBeInTheDocument();
    });
});
