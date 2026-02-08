import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Input } from './Input';
import React from 'react';

// Mock the CSS module
vi.mock('./Input.module.css', () => ({
    default: {
        container: 'container',
        label: 'label',
        inputWrapper: 'inputWrapper',
        input: 'input',
        errorText: 'errorText',
        helperText: 'helperText',
        hasError: 'hasError',
        hasIcon: 'hasIcon',
        iconContainer: 'iconContainer'
    }
}));

describe('Input', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with label and id', () => {
        render(<Input label="Username" id="username" />);
        const input = screen.getByLabelText(/username/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'username');
    });

    it('renders without label', () => {
        render(<Input placeholder="No label" />);
        const input = screen.getByPlaceholderText(/no label/i);
        expect(input).toBeInTheDocument();
        // Should not have a label element linked
        const label = screen.queryByLabelText(/no label/i);
        expect(label).not.toBeInTheDocument();
    });

    it('displays error message and styling', () => {
        render(<Input label="Email" error="Invalid email address" />);
        const errorMsg = screen.getByText(/invalid email address/i);
        expect(errorMsg).toBeInTheDocument();

        // Check for error class on container (we can't easily check parent class without custom matchers or querying via container)
        // Instead, check aria-invalid on input
        const input = screen.getByLabelText(/email/i);
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('displays helper text', () => {
        render(<Input label="Password" helperText="Must be 8 chars" />);
        const helper = screen.getByText(/must be 8 chars/i);
        expect(helper).toBeInTheDocument();
    });

    it('does not display helper text when error is present', () => {
        render(<Input label="Password" helperText="Must be 8 chars" error="Too short" />);
        const error = screen.getByText(/too short/i);
        expect(error).toBeInTheDocument();
        const helper = screen.queryByText(/must be 8 chars/i);
        expect(helper).not.toBeInTheDocument();
    });

    it('renders with an icon', () => {
        const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
        render(<Input icon={MockIcon} />);
        const icon = screen.getByTestId('mock-icon');
        expect(icon).toBeInTheDocument();
    });

    it('handles interactions correctly', () => {
        const handleChange = vi.fn();
        render(<Input label="Test" onChange={handleChange} />);
        const input = screen.getByLabelText(/test/i);

        fireEvent.change(input, { target: { value: 'New Value' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
