import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Checkbox } from './Checkbox';
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

describe('Checkbox', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with label and id', () => {
        render(<Checkbox label="Subscribe" id="subscribe" />);
        const checkbox = screen.getByLabelText(/subscribe/i);
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveAttribute('id', 'subscribe');
        expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('handles interaction correctly', () => {
        const handleChange = vi.fn();
        render(<Checkbox label="Agree" onChange={handleChange} />);
        const checkbox = screen.getByLabelText(/agree/i);

        fireEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('renders description', () => {
        render(<Checkbox label="Notifications" description="Receive email updates" />);
        const description = screen.getByText(/receive email updates/i);
        expect(description).toBeInTheDocument();
    });

    it('displays error styling', () => {
        render(<Checkbox label="Privacy Policy" error="Must agree" />);
        const checkbox = screen.getByLabelText(/privacy policy/i);
        expect(checkbox).toHaveAttribute('aria-invalid', 'true');

        // Check for error class on label
        const label = screen.getByText(/privacy policy/i);
        expect(label).toHaveClass('error');
    });
});
