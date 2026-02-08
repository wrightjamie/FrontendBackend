/**
 * @file AuthContext.test.jsx
 * @description Unit tests for the AuthContext provider.
 * 
 * @tests
 * 1. Initializes with loading state and performs initial auth check.
 * 2. Loads user data on successful auth check.
 * 3. Handles login functionality and updates user state.
 * 4. Handles logout functionality and clears user state.
 * 5. Mocks API calls (fetch) and Toast notifications.
 */
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Mock ToastContext
vi.mock('./ToastContext', () => ({
    useToast: () => ({
        addToast: vi.fn()
    })
}));

// Test component to consume the context
const TestComponent = () => {
    const { user, login, logout, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            {user ? (
                <>
                    <div data-testid="user-name">{user.username}</div>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <button onClick={() => login('testuser', 'password')}>Login</button>
            )}
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('initializes with loading state and checks auth', async () => {
        // Mock initial auth check failing (not logged in)
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });
        // Mock checkSetup
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ needsSetup: false })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Login')).toBeInTheDocument();
        });
    });

    it('loads user on successful auth check', async () => {
        const mockUser = { username: 'admin', role: 'admin' };

        // Mock auth check success
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });
        // Mock checkSetup
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ needsSetup: false })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('admin');
        });
    });

    it('handles login successfully', async () => {
        // Initial state: not logged in
        global.fetch.mockResolvedValueOnce({ ok: false }); // checkAuth
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ needsSetup: false }) }); // checkSetup

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByText('Login'));

        // Mock login API call
        const mockUser = { username: 'loginUser', role: 'editor' };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        const loginBtn = screen.getByText('Login');

        await act(async () => {
            loginBtn.click();
        });

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('loginUser');
        });
    });

    it('handles logout successfully', async () => {
        const mockUser = { username: 'logoutUser' };

        // Initial state: logged in
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ needsSetup: false }) });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByTestId('user-name'));

        // Mock logout API call
        global.fetch.mockResolvedValueOnce({ ok: true });

        const logoutBtn = screen.getByText('Logout');

        await act(async () => {
            logoutBtn.click();
        });

        await waitFor(() => {
            expect(screen.getByText('Login')).toBeInTheDocument();
        });
    });
});
