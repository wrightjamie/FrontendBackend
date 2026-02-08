/**
 * @file Button.test.jsx
 * @description Unit tests for the Button component.
 * 
 * @tests
 * 1. Renders with default props (class, intent, size).
 * 2. Renders with custom intent (e.g., 'danger').
 * 3. Handles click events.
 * 4. Renders 'grouped' variant correctly.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Button } from './Button';
import React from 'react';

// Mock the CSS module
vi.mock('./Button.module.css', () => ({
    default: {
        btn: 'btn',
        primary: 'primary',
        danger: 'danger',
        md: 'md',
        grouped: 'grouped'
    }
}));

describe('Button', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass('primary'); // Default intent
        expect(button).toHaveClass('md'); // Default size
    });

    it('renders with custom intent', () => {
        render(<Button intent="danger">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        expect(button).toHaveClass('danger');
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders grouped variant correctly', () => {
        render(<Button grouped>Grouped</Button>);
        const button = screen.getByRole('button', { name: /grouped/i });
        expect(button).toHaveClass('grouped');
    });
});
