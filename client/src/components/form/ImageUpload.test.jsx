/**
 * @file ImageUpload.test.jsx
 * @description Unit tests for the ImageUpload component.
 * 
 * @tests
 * 1. Renders upload area with label.
 * 2. Opens file picker on click.
 * 3. Handles successful file upload.
 * 4. Displays error on upload failure.
 * 5. Shows preview after upload when showPreview is true.
 * 6. Handles remove button click.
 * 7. Displays current image when provided.
 */
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import ImageUpload from './ImageUpload';
import React from 'react';

// Mock the CSS module
vi.mock('./ImageUpload.module.css', () => ({
    default: {
        container: 'container',
        label: 'label',
        uploadArea: 'uploadArea',
        previewContainer: 'previewContainer',
        preview: 'preview',
        removeBtn: 'removeBtn',
        placeholder: 'placeholder',
        uploadIcon: 'uploadIcon',
        hiddenInput: 'hiddenInput',
        error: 'error'
    }
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    X: () => <span>[Icon-X]</span>,
    Upload: () => <span data-testid="upload-icon">[Icon-Upload]</span>,
    Image: () => <span>[Icon-Image]</span>
}));

// Mock fetch
global.fetch = vi.fn();

describe('ImageUpload', () => {
    beforeEach(() => {
        global.fetch.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders upload area with label', () => {
        render(<ImageUpload label="Upload Logo" />);

        expect(screen.getByText(/upload logo/i)).toBeInTheDocument();
        expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    });

    it('renders with default label', () => {
        render(<ImageUpload />);

        expect(screen.getByText(/upload image/i)).toBeInTheDocument();
    });

    it('opens file picker on click', () => {
        const { container } = render(<ImageUpload />);

        const fileInput = container.querySelector('input[type="file"]');
        const clickSpy = vi.spyOn(fileInput, 'click');

        const uploadArea = container.querySelector('.uploadArea');
        fireEvent.click(uploadArea);

        expect(clickSpy).toHaveBeenCalled();
    });

    it('handles successful file upload', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ url: '/uploads/test.jpg', filename: 'test.jpg' })
        });

        const onUpload = vi.fn();
        const { container } = render(<ImageUpload onUpload={onUpload} />);

        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.any(Object));
            expect(onUpload).toHaveBeenCalledWith({ url: '/uploads/test.jpg', filename: 'test.jpg' });
        });
    });

    it('displays error on upload failure', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Upload failed' })
        });

        const { container } = render(<ImageUpload />);

        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
        });
    });

    it('shows preview after upload when showPreview is true', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ url: '/uploads/test.jpg', filename: 'test.jpg' })
        });

        const { container } = render(<ImageUpload showPreview={true} />);

        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            const preview = screen.getByAltText(/preview/i);
            expect(preview).toBeInTheDocument();
            expect(preview).toHaveAttribute('src', '/uploads/test.jpg');
        });
    });

    it('does not show preview when showPreview is false', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ url: '/uploads/test.jpg', filename: 'test.jpg' })
        });

        const { container } = render(<ImageUpload showPreview={false} />);

        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.queryByAltText(/preview/i)).not.toBeInTheDocument();
        });
    });

    it('handles remove button click', async () => {
        const onUpload = vi.fn();
        render(<ImageUpload currentImage="/uploads/existing.jpg" onUpload={onUpload} />);

        const removeButton = screen.getByTitle(/remove image/i);
        fireEvent.click(removeButton);

        expect(onUpload).toHaveBeenCalledWith(null);
        expect(screen.queryByAltText(/preview/i)).not.toBeInTheDocument();
    });

    it('displays current image when provided', () => {
        render(<ImageUpload currentImage="/uploads/existing.jpg" />);

        const preview = screen.getByAltText(/preview/i);
        expect(preview).toBeInTheDocument();
        expect(preview).toHaveAttribute('src', '/uploads/existing.jpg');
    });

    it('shows uploading state during upload', async () => {
        global.fetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            json: async () => ({ url: '/uploads/test.jpg' })
        }), 100)));

        const { container } = render(<ImageUpload />);

        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(await screen.findByText(/uploading/i)).toBeInTheDocument();
    });

    it('accepts only image files', () => {
        const { container } = render(<ImageUpload />);

        const fileInput = container.querySelector('input[type="file"]');
        expect(fileInput).toHaveAttribute('accept', 'image/*');
    });
});
