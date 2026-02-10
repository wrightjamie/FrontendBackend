/**
 * @file ProtectedRoute.test.jsx
 * @description Unit tests for the ProtectedRoute component.
 * 
 * @tests
 * 1. Shows loading state while authentication is loading.
 * 2. Redirects to login when user is not authenticated.
 * 3. Renders children when user is authenticated.
 * 4. Allows access when user has allowed role.
 * 5. Redirects to home when user lacks required role.
 * 6. Allows access when no roles are specified.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import React from 'react';

// Mock AuthContext
let mockUser = null;
let mockLoading = false;

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        loading: mockLoading
    })
}));

describe('ProtectedRoute', () => {
    beforeEach(() => {
        mockUser = null;
        mockLoading = false;
    });

    afterEach(() => {
        cleanup();
    });

    const renderProtectedRoute = (allowedRoles = [], initialPath = '/') => {
        return render(
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute allowedRoles={allowedRoles}>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('shows loading state while authentication is loading', () => {
        mockLoading = true;
        renderProtectedRoute([], '/protected');

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
        expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', () => {
        mockUser = null;
        mockLoading = false;
        renderProtectedRoute([], '/protected');

        expect(screen.getByText(/login page/i)).toBeInTheDocument();
        expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('renders children when user is authenticated', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;
        renderProtectedRoute([], '/protected');

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('allows access when user has allowed role', () => {
        mockUser = { username: 'admin', role: 'admin' };
        mockLoading = false;
        renderProtectedRoute(['admin'], '/protected');

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('redirects to home when user lacks required role', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;

        renderProtectedRoute(['admin'], '/protected');

        expect(screen.getByText(/home page/i)).toBeInTheDocument();
        expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('allows access when no roles are specified', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;
        renderProtectedRoute([], '/protected');

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('allows access when user role is in allowed roles list', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;
        renderProtectedRoute(['user', 'admin'], '/protected');

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });
});
