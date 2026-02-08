/**
 * @file Badge.test.jsx
 * @description Unit tests for the Badge component.
 * 
 * @tests
 * 1. Renders children content.
 * 2. Applies default variant class.
 * 3. Applies specific variant classes (e.g., 'success').
 * 4. Renders with optional Icon.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Badge } from './Badge';
import React from 'react';

// Mock the CSS module
vi.mock('./Badge.module.css', () => ({
    default: {
        badge: 'badge',
        default: 'default',
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        info: 'info',
        icon: 'icon'
    }
}));

describe('Badge', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders children correctly', () => {
        render(<Badge>Status</Badge>);
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('applies default variant class', () => {
        render(<Badge>Default</Badge>);
        // The text is wrapped in a span, which is inside the badge span.
        // So we need to look up to find the badge container
        const textSpan = screen.getByText('Default');
        const badge = textSpan.closest('.badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('badge');
        expect(badge).not.toHaveClass('success');
    });

    it('applies specific variant class', () => {
        render(<Badge variant="success">Active</Badge>);
        const textSpan = screen.getByText('Active');
        const badge = textSpan.closest('.badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('success');
    });

    it('renders with an icon', () => {
        const MockIcon = () => <span data-testid="badge-icon">Icon</span>;
        render(<Badge icon={MockIcon}>With Icon</Badge>);
        expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    });
});
