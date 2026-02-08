/**
 * @file FileUpload.test.jsx
 * @description Unit tests for the FileUpload component.
 * 
 * @tests
 * 1. Renders FileUpload with label.
 * 2. Displays 'Choose File...' by default.
 * 3. Updates label to 'Change File: filename' and shows filename after selection.
 * 4. Calls onChange with the file event.
 * 5. Displays error message and applies aria-invalid.
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FileUpload } from './FileUpload';
import React from 'react';

// Mock the CSS module
vi.mock('./FileUpload.module.css', () => ({
    default: {
        container: 'container',
        label: 'label',
        uploadButton: 'uploadButton',
        hiddenInput: 'hiddenInput',
        errorText: 'errorText',
        fileName: 'fileName'
    }
}));

describe('FileUpload', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with label and initial state', () => {
        render(<FileUpload label="Profile Image" />);
        expect(screen.getByText('Profile Image')).toBeInTheDocument();
        expect(screen.getByText('Choose File...')).toBeInTheDocument();
    });

    it('handles file selection', () => {
        const handleChange = vi.fn();
        render(<FileUpload onChange={handleChange} />);

        const input = screen.getByLabelText('Choose File...');
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        fireEvent.change(input, { target: { files: [file] } });

        expect(handleChange).toHaveBeenCalled();
        expect(screen.getByText('Change File: hello.png')).toBeInTheDocument();
        expect(screen.getByText('hello.png')).toHaveClass('fileName');
    });

    it('displays error message', () => {
        render(<FileUpload error="File too large" />);
        expect(screen.getByText('File too large')).toHaveClass('errorText');

        // Use container.querySelector for hidden input accessibility if needed, 
        // but label is linked to input via htmlFor
        const input = screen.getByLabelText('Choose File...');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });
});
