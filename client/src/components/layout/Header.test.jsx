/**
 * @file Header.test.jsx
 * @description Unit tests for the Header component.
 * 
 * @tests
 * 1. Renders header with site title.
 * 2. Displays logo image when available.
 * 3. Displays default icon when no logo.
 * 4. Shows login button when not logged in.
 * 5. Shows username when logged in.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import React from 'react';

// Mock the CSS module
vi.mock('./Header.module.css', () => ({
    default: {
        header: 'header',
        container: 'container',
        logo: 'logo',
        logoImage: 'logoImage',
        logoIcon: 'logoIcon',
        logoText: 'logoText',
        actions: 'actions',
        userBtn: 'userBtn'
    }
}));

// Mock AuthContext
let mockUser = null;
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser
    })
}));

// Mock useSiteMeta hook
let mockMeta = { title: 'Test Site', logo: '' };
vi.mock('../../hooks/useSiteMeta', () => ({
    useSiteMeta: () => ({
        meta: mockMeta
    })
}));

// Mock Button component
vi.mock('../ui/Button', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Zap: () => <span data-testid="zap-icon">Zap</span>,
    User: () => <span data-testid="user-icon">User</span>
}));

describe('Header', () => {
    beforeEach(() => {
        mockUser = null;
        mockMeta = { title: 'Test Site', logo: '' };
    });

    afterEach(() => {
        cleanup();
    });

    const renderHeader = () => {
        return render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    };

    it('renders header with site title', () => {
        mockMeta = { title: 'My Awesome Site', logo: '' };
        renderHeader();

        expect(screen.getByText(/my awesome site/i)).toBeInTheDocument();
    });

    it('displays logo image when available', () => {
        mockMeta = { title: 'Test Site', logo: '/uploads/logo.png' };
        renderHeader();

        const logo = screen.getByAltText(/test site/i);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', expect.stringContaining('/uploads/logo.png'));
    });

    it('displays default icon when no logo', () => {
        mockMeta = { title: 'Test Site', logo: '' };
        renderHeader();

        expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('shows login button when not logged in', () => {
        mockUser = null;
        renderHeader();

        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it('shows username when logged in', () => {
        mockUser = { username: 'testuser', role: 'user' };
        renderHeader();

        expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    it('shows default "User" text when logged in without username', () => {
        mockUser = { role: 'user' };
        renderHeader();

        expect(screen.getByText(/user/i)).toBeInTheDocument();
    });

    it('renders home link with correct path', () => {
        renderHeader();

        const homeLink = screen.getByRole('link');
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders user button with popover target', () => {
        renderHeader();

        const userButton = screen.getByRole('button');
        expect(userButton).toHaveAttribute('popovertarget', 'login-popover');
    });
});
