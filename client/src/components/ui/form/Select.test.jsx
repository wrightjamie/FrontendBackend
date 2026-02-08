/**
 * @file Select.test.jsx
 * @description Unit tests for the Select component.
 * 
 * @tests
 * 1. Renders with label and ID.
 * 2. Renders options correctly from array.
 * 3. Renders placeholder option (disabled).
 * 4. Handles selection changes.
 * 5. Displays error message and invalid state.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Select } from './Select';
import React from 'react';

// Mock the CSS module
vi.mock('./Select.module.css', () => ({
    default: {
        container: 'container',
        label: 'label',
        selectWrapper: 'selectWrapper',
        select: 'select',
        arrow: 'arrow',
        errorText: 'errorText',
        helperText: 'helperText',
        hasError: 'hasError'
    }
}));

const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
];

describe('Select', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with label and id', () => {
        render(<Select label="Choose" id="select-id" options={mockOptions} />);
        const select = screen.getByLabelText(/choose/i);
        expect(select).toBeInTheDocument();
        expect(select).toHaveAttribute('id', 'select-id');
    });

    it('renders options correctly', () => {
        render(<Select options={mockOptions} />);
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveValue('option1');
        expect(options[0]).toHaveTextContent('Option 1');
    });

    it('renders placeholder', () => {
        render(<Select placeholder="Select an option" options={mockOptions} />);
        const placeholder = screen.getByText('Select an option');
        expect(placeholder).toBeInTheDocument();
        expect(placeholder).toBeDisabled();
    });

    it('handles selection changes', () => {
        const handleChange = vi.fn();
        render(<Select label="Test" options={mockOptions} onChange={handleChange} />);
        const select = screen.getByLabelText(/test/i);

        fireEvent.change(select, { target: { value: 'option2' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(select.value).toBe('option2');
    });

    it('displays error message', () => {
        render(<Select label="Test" error="Selection required" options={mockOptions} />);
        const error = screen.getByText(/selection required/i);
        expect(error).toBeInTheDocument();
        const select = screen.getByLabelText(/test/i);
        expect(select).toHaveAttribute('aria-invalid', 'true');
    });
});
