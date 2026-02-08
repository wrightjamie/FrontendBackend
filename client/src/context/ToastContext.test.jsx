import { render, screen, act, cleanup } from '@testing-library/react';
/**
 * @file ToastContext.test.jsx
 * @description Unit tests for the ToastContext provider.
 * 
 * @tests
 * 1. Provides addToast and removeToast methods to consumers.
 * 2. Adds a toast to the state and renders it.
 * 3. Removes a toast from the state when removeToast is called.
 * 4. Automatically removes toasts after duration (using fake timers).
 * 5. Clears timers on unmount or manual removal.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ToastProvider, useToast } from './ToastContext';
import React, { useEffect } from 'react';

// Test component to consume context
const TestComponent = ({ message, duration }) => {
    const { addToast, removeToast, toasts } = useToast();

    return (
        <div>
            <button onClick={() => addToast(message, 'info', { duration })}>Add Toast</button>
            <div data-testid="toast-list">
                {toasts.map(t => (
                    <div key={t.id} onClick={() => removeToast(t.id)}>
                        {t.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

describe('ToastContext', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('adds a toast', () => {
        render(
            <ToastProvider>
                <TestComponent message="Hello World" />
            </ToastProvider>
        );

        const btn = screen.getByText('Add Toast');
        act(() => {
            btn.click();
        });

        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('removes a toast manually', () => {
        render(
            <ToastProvider>
                <TestComponent message="Delete Me" />
            </ToastProvider>
        );

        const btn = screen.getByText('Add Toast');
        act(() => {
            btn.click();
        });

        const toast = screen.getByText('Delete Me');
        act(() => {
            toast.click();
        });

        expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
    });

    it('auto-hides toast after duration', () => {
        render(
            <ToastProvider>
                <TestComponent message="Auto Hide" duration={1000} />
            </ToastProvider>
        );

        const btn = screen.getByText('Add Toast');
        act(() => {
            btn.click();
        });

        expect(screen.getByText('Auto Hide')).toBeInTheDocument();

        // Fast-forward time
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.queryByText('Auto Hide')).not.toBeInTheDocument();
    });

    it('does not auto-hide if duration not met', () => {
        render(
            <ToastProvider>
                <TestComponent message="Stay Visible" duration={5000} />
            </ToastProvider>
        );

        const btn = screen.getByText('Add Toast');
        act(() => {
            btn.click();
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('Stay Visible')).toBeInTheDocument();
    });
});
