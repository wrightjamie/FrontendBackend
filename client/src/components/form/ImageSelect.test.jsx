/**
 * @file ImageSelect.test.jsx
 * @description Unit tests for the ImageSelect component.
 * 
 * @tests
 * 1. Renders with label and placeholder.
 * 2. Opens popover on trigger click.
 * 3. Displays selected image preview.
 * 4. Switches between browse and upload tabs.
 * 5. Fetches images when browse tab is opened.
 * 6. Handles image selection from library.
 * 7. Displays loading state while fetching.
 * 8. Shows empty state when no images.
 */
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import ImageSelect from './ImageSelect';
import React from 'react';

// Mock the CSS module
vi.mock('./ImageSelect.module.css', () => ({
    default: {
        container: 'container',
        label: 'label',
        trigger: 'trigger',
        previewWrapper: 'previewWrapper',
        selectedPreview: 'selectedPreview',
        changeOverlay: 'changeOverlay',
        placeholder: 'placeholder',
        popover: 'popover',
        popoverHeader: 'popoverHeader',
        tabs: 'tabs',
        tab: 'tab',
        activeTab: 'activeTab',
        popoverContent: 'popoverContent',
        libraryGrid: 'libraryGrid',
        status: 'status',
        imageCard: 'imageCard',
        selectedCard: 'selectedCard',
        selectedOverlay: 'selectedOverlay',
        uploadSection: 'uploadSection'
    }
}));

// Mock apiClient
const mockApiClient = vi.fn();
vi.mock('../../api/apiClient', () => ({
    default: mockApiClient
}));

// Mock ToastContext
const mockAddToast = vi.fn();
vi.mock('../../context/ToastContext', () => ({
    useToast: () => ({
        addToast: mockAddToast
    })
}));

// Mock ImageUpload component
vi.mock('./ImageUpload', () => ({
    default: ({ onUpload }) => (
        <div data-testid="image-upload">
            <button onClick={() => onUpload({ url: '/uploads/new.jpg' })}>
                Mock Upload
            </button>
        </div>
    )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Pencil: () => <span>Pencil</span>,
    Library: () => <span>Library</span>,
    Upload: () => <span>Upload</span>,
    Check: () => <span data-testid="check-icon">Check</span>
}));

describe('ImageSelect', () => {
    beforeEach(() => {
        mockApiClient.mockClear();
        mockAddToast.mockClear();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders with label and placeholder', () => {
        render(<ImageSelect label="Select Logo" onChange={vi.fn()} />);

        expect(screen.getByText(/select logo/i)).toBeInTheDocument();
        expect(screen.getByText(/pick an image/i)).toBeInTheDocument();
    });

    it('renders with default label', () => {
        render(<ImageSelect onChange={vi.fn()} />);

        expect(screen.getByText(/select image/i)).toBeInTheDocument();
    });

    it('opens popover on trigger click', () => {
        const { container } = render(<ImageSelect onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        expect(screen.getByText(/browse library/i)).toBeInTheDocument();
        expect(screen.getByText(/upload new/i)).toBeInTheDocument();
    });

    it('displays selected image preview', () => {
        render(<ImageSelect value="/uploads/selected.jpg" onChange={vi.fn()} />);

        const preview = screen.getByAltText(/selected/i);
        expect(preview).toBeInTheDocument();
        expect(preview).toHaveAttribute('src', expect.stringContaining('/uploads/selected.jpg'));
    });

    it('switches between browse and upload tabs', () => {
        mockApiClient.mockResolvedValue([]);
        const { container } = render(<ImageSelect onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        const uploadTab = screen.getByText(/upload new/i).closest('button');
        fireEvent.click(uploadTab);

        expect(screen.getByTestId('image-upload')).toBeInTheDocument();

        const browseTab = screen.getByText(/browse library/i).closest('button');
        fireEvent.click(browseTab);

        expect(screen.queryByTestId('image-upload')).not.toBeInTheDocument();
    });

    it('fetches images when browse tab is opened', async () => {
        mockApiClient.mockResolvedValue([
            { _id: '1', url: '/uploads/img1.jpg', title: 'Image 1' },
            { _id: '2', url: '/uploads/img2.jpg', title: 'Image 2' }
        ]);

        const { container } = render(<ImageSelect onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        await waitFor(() => {
            expect(mockApiClient).toHaveBeenCalledWith('/upload');
        });
    });

    it('handles image selection from library', async () => {
        mockApiClient.mockResolvedValue([
            { _id: '1', url: '/uploads/img1.jpg', title: 'Image 1', thumbnailUrl: '/uploads/thumb1.jpg' }
        ]);

        const onChange = vi.fn();
        const { container } = render(<ImageSelect onChange={onChange} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        await waitFor(() => {
            const imageCard = screen.getByAltText(/image 1/i).closest('.imageCard');
            fireEvent.click(imageCard);
        });

        expect(onChange).toHaveBeenCalledWith('/uploads/img1.jpg');
    });

    it('displays loading state while fetching', async () => {
        mockApiClient.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));

        const { container } = render(<ImageSelect onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    });

    it('shows empty state when no images', async () => {
        mockApiClient.mockResolvedValue([]);

        const { container } = render(<ImageSelect onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        await waitFor(() => {
            expect(screen.getByText(/no images found/i)).toBeInTheDocument();
        });
    });

    it('handles upload success from upload tab', async () => {
        mockApiClient.mockResolvedValue([]);
        const onChange = vi.fn();

        const { container } = render(<ImageSelect onChange={onChange} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        const uploadTab = screen.getByText(/upload new/i).closest('button');
        fireEvent.click(uploadTab);

        const uploadButton = screen.getByText(/mock upload/i);
        fireEvent.click(uploadButton);

        expect(onChange).toHaveBeenCalledWith('/uploads/new.jpg');
        expect(mockAddToast).toHaveBeenCalledWith('Image uploaded and selected', 'success');
    });

    it('displays error toast on fetch failure', async () => {
        mockApiClient.mockRejectedValue(new Error('Network error'));

        const { container } = render(<ImageSelect onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith('Failed to load media library', 'error');
        });
    });

    it('highlights selected image in library', async () => {
        mockApiClient.mockResolvedValue([
            { _id: '1', url: '/uploads/img1.jpg', title: 'Image 1' },
            { _id: '2', url: '/uploads/img2.jpg', title: 'Image 2' }
        ]);

        const { container } = render(<ImageSelect value="/uploads/img1.jpg" onChange={vi.fn()} />);

        const trigger = container.querySelector('.trigger');
        fireEvent.click(trigger);

        await waitFor(() => {
            const selectedCard = container.querySelector('.selectedCard');
            expect(selectedCard).toBeInTheDocument();
            expect(screen.getByTestId('check-icon')).toBeInTheDocument();
        });
    });
});
