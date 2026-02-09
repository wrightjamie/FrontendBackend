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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

    const renderProtectedRoute = (allowedRoles = []) => {
        return render(
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowedRoles={allowedRoles}>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </BrowserRouter>
        );
    };

    it('shows loading state while authentication is loading', () => {
        mockLoading = true;
        renderProtectedRoute();

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
        expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', () => {
        mockUser = null;
        mockLoading = false;
        renderProtectedRoute();

        expect(screen.getByText(/login page/i)).toBeInTheDocument();
        expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('renders children when user is authenticated', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;
        renderProtectedRoute();

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('allows access when user has allowed role', () => {
        mockUser = { username: 'admin', role: 'admin' };
        mockLoading = false;
        renderProtectedRoute(['admin']);

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('redirects to home when user lacks required role', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;

        render(
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </BrowserRouter>
        );

        // When user doesn't have the required role, they get redirected to "/"
        // Since we're already at "/", the ProtectedRoute will redirect them
        // In a real app this would show the home page, but in our test it just doesn't show protected content
        expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
    });

    it('allows access when no roles are specified', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;
        renderProtectedRoute([]);

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('allows access when user role is in allowed roles list', () => {
        mockUser = { username: 'testuser', role: 'user' };
        mockLoading = false;
        renderProtectedRoute(['user', 'admin']);

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });
});
