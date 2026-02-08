/**
 * @file RadioGroup.test.jsx
 * @description Unit tests for the RadioGroup and Radio components.
 * 
 * @tests
 * 1. Renders RadioGroup with label and options.
 * 2. Pre-selects the correct radio button based on value prop.
 * 3. Calls onChange with correctly selected value.
 * 4. Displays error message and applies error styling.
 * 5. Handles disabled options.
 * 6. Supports 'row' and 'column' direction layouts.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { RadioGroup } from './RadioGroup';
import React from 'react';

// Mock the CSS modules
vi.mock('./RadioGroup.module.css', () => ({
    default: {
        fieldset: 'fieldset',
        legend: 'legend',
        column: 'column',
        row: 'row',
        errorText: 'errorText'
    }
}));

vi.mock('./CheckboxRadio.module.css', () => ({
    default: {
        container: 'container',
        input: 'input',
        textWrapper: 'textWrapper',
        label: 'label',
        error: 'error'
    }
}));

const mockOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green', disabled: true }
];

describe('RadioGroup', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with label and options', () => {
        render(<RadioGroup label="Select Color" options={mockOptions} onChange={() => { }} />);
        expect(screen.getByText('Select Color')).toBeInTheDocument();
        expect(screen.getByLabelText('Red')).toBeInTheDocument();
        expect(screen.getByLabelText('Blue')).toBeInTheDocument();
        expect(screen.getByLabelText('Green')).toBeInTheDocument();
    });

    it('pre-selects the correct value', () => {
        render(<RadioGroup value="blue" options={mockOptions} onChange={() => { }} />);
        expect(screen.getByLabelText('Blue')).toBeChecked();
        expect(screen.getByLabelText('Red')).not.toBeChecked();
    });

    it('calls onChange with the selected value', () => {
        const handleChange = vi.fn();
        render(<RadioGroup options={mockOptions} onChange={handleChange} />);

        fireEvent.click(screen.getByLabelText('Red'));
        expect(handleChange).toHaveBeenCalledWith('red');
    });

    it('displays error message', () => {
        render(<RadioGroup error="Please select a color" options={mockOptions} onChange={() => { }} />);
        expect(screen.getByText('Please select a color')).toHaveClass('errorText');
    });

    it('handles disabled options', () => {
        render(<RadioGroup options={mockOptions} onChange={() => { }} />);
        expect(screen.getByLabelText('Green')).toBeDisabled();
    });

    it('applies direction class', () => {
        const { container } = render(<RadioGroup direction="row" options={mockOptions} onChange={() => { }} />);
        const fieldset = container.querySelector('fieldset');
        expect(fieldset).toHaveClass('row');
    });
});
