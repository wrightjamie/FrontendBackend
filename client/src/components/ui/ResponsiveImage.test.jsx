/**
 * @file ResponsiveImage.test.jsx
 * @description Unit tests for the ResponsiveImage component.
 * 
 * @tests
 * 1. Renders an img element with correct src and alt attributes.
 * 2. Generates a correct srcset attribute from the provided image variants.
 * 3. Uses fallback values for alt text (title or originalName) if not explicitly provided.
 * 4. Renders nothing if no image object is provided.
 * 5. Applies custom classNames and the sizes attribute correctly.
 * 6. Handles images without variants gracefully (no srcset).
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import ResponsiveImage from './ResponsiveImage';
import React from 'react';

// Mock the hook
vi.mock('../../hooks/useSiteMeta', () => ({
    useSiteMeta: vi.fn(() => ({
        meta: {
            media: {
                responsive: {
                    sizes: {
                        sm: 640,
                        md: 1024,
                        lg: 1920
                    }
                }
            }
        }
    }))
}));

describe('ResponsiveImage', () => {
    afterEach(() => {
        cleanup();
    });

    const mockImage = {
        url: '/uploads/original.jpg',
        title: 'Test Image',
        originalName: 'original.jpg',
        variants: {
            sm: '/uploads/responsive/test-sm.webp',
            md: '/uploads/responsive/test-md.webp',
            lg: '/uploads/responsive/test-lg.webp'
        }
    };

    it('renders an img element with correct src and alt', () => {
        render(<ResponsiveImage image={mockImage} alt="Custom Alt" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', '/uploads/original.jpg');
        expect(img).toHaveAttribute('alt', 'Custom Alt');
    });

    it('generates a correct srcset from variants', () => {
        render(<ResponsiveImage image={mockImage} />);
        const img = screen.getByRole('img');
        const srcSet = img.getAttribute('srcset');

        expect(srcSet).toContain('/uploads/responsive/test-sm.webp 640w');
        expect(srcSet).toContain('/uploads/responsive/test-md.webp 1024w');
        expect(srcSet).toContain('/uploads/responsive/test-lg.webp 1920w');
    });

    it('uses fallback values for alt if not provided', () => {
        render(<ResponsiveImage image={mockImage} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Test Image');
    });

    it('renders nothing if no image is provided', () => {
        const { container } = render(<ResponsiveImage image={null} />);
        expect(container.firstChild).toBeNull();
    });

    it('applies custom className and sizes', () => {
        render(
            <ResponsiveImage
                image={mockImage}
                className="custom-img"
                sizes="(max-width: 600px) 100vw, 50vw"
            />
        );
        const img = screen.getByRole('img');
        expect(img).toHaveClass('custom-img');
        expect(img).toHaveAttribute('sizes', '(max-width: 600px) 100vw, 50vw');
    });

    it('handles image without variants gracefully', () => {
        const simpleImage = { url: '/uploads/simple.jpg', title: 'Simple' };
        render(<ResponsiveImage image={simpleImage} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', '/uploads/simple.jpg');
        expect(img.getAttribute('srcset')).toBeNull();
    });
});
