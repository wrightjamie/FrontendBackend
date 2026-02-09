/**
 * @file Radio.test.jsx
 * @description Unit tests for the Radio component.
 * 
 * @tests
 * 1. Renders radio with label.
 * 2. Renders with description.
 * 3. Handles error state.
 * 4. Generates unique ID when not provided.
 * 5. Uses provided ID.
 * 6. Handles change events.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Radio } from './Radio';
import React from 'react';

// Mock the CSS module
vi.mock('./CheckboxRadio.module.css', () => ({
    default: {
        container: 'container',
        input: 'input',
        textWrapper: 'textWrapper',
        label: 'label',
        description: 'description',
        error: 'error'
    }
}));

describe('Radio', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders radio with label', () => {
        render(<Radio label="Option 1" />);

        const radio = screen.getByLabelText(/option 1/i);
        expect(radio).toBeInTheDocument();
        expect(radio).toHaveAttribute('type', 'radio');
    });

    it('renders with description', () => {
        render(<Radio label="Option 1" description="This is a description" />);

        expect(screen.getByText(/this is a description/i)).toBeInTheDocument();
    });

    it('handles error state', () => {
        render(<Radio label="Option 1" error="This field is required" />);

        const radio = screen.getByLabelText(/option 1/i);
        expect(radio).toHaveAttribute('aria-invalid', 'true');
        expect(radio).toHaveClass('error');
    });

    it('generates unique ID when not provided', () => {
        const { container } = render(<Radio label="Option 1" />);

        const radio = container.querySelector('input[type="radio"]');
        expect(radio).toHaveAttribute('id');
        expect(radio.id).toMatch(/^radio-/);
    });

    it('uses provided ID', () => {
        render(<Radio label="Option 1" id="custom-id" />);

        const radio = screen.getByLabelText(/option 1/i);
        expect(radio).toHaveAttribute('id', 'custom-id');
    });

    it('handles change events', () => {
        const handleChange = vi.fn();
        render(<Radio label="Option 1" onChange={handleChange} />);

        const radio = screen.getByLabelText(/option 1/i);
        fireEvent.click(radio);

        expect(handleChange).toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = render(<Radio label="Option 1" className="custom-class" />);

        const label = container.querySelector('label');
        expect(label).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef();
        render(<Radio label="Option 1" ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current.type).toBe('radio');
    });

    it('passes through additional props', () => {
        render(<Radio label="Option 1" name="test-group" value="option1" />);

        const radio = screen.getByLabelText(/option 1/i);
        expect(radio).toHaveAttribute('name', 'test-group');
        expect(radio).toHaveAttribute('value', 'option1');
    });
});
