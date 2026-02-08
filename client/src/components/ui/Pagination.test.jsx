import { render, screen, fireEvent, cleanup } from '@testing-library/react';
/**
 * @file Pagination.test.jsx
 * @description Unit tests for the Pagination component.
 * 
 * @tests
 * 1. Renders correct page numbers based on current page and total pages.
 * 2. Renders navigation buttons (Next, Prev, First, Last).
 * 3. Disables navigation buttons at boundaries (first/last page).
 * 4. Calls onPageChange callback when a page or button is clicked.
 * 5. Does not render when totalPages <= 1.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import Pagination from './Pagination';
import React from 'react';

// Mock CSS
vi.mock('./Pagination.module.css', () => ({
    default: {
        pagination: 'pagination',
        controls: 'controls',
        pages: 'pages',
        pageBtn: 'pageBtn',
        active: 'active'
    }
}));

describe('Pagination', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correct page numbers', () => {
        render(<Pagination currentPage={1} totalPages={10} onPageChange={() => { }} />);
        // Should show 1, 2, 3, 4, 5
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.queryByText('6')).not.toBeInTheDocument();
    });

    it('renders correct page numbers when in middle', () => {
        render(<Pagination currentPage={5} totalPages={10} onPageChange={() => { }} />);
        // Should show 3, 4, 5, 6, 7 (maxVisible=5, centered)
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('handles interactions', () => {
        const handlePageChange = vi.fn();
        render(<Pagination currentPage={3} totalPages={10} onPageChange={handlePageChange} />);

        fireEvent.click(screen.getByTitle('Next Page'));
        expect(handlePageChange).toHaveBeenCalledWith(4);

        fireEvent.click(screen.getByTitle('Previous Page'));
        expect(handlePageChange).toHaveBeenCalledWith(2);

        fireEvent.click(screen.getByTitle('First Page'));
        expect(handlePageChange).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByTitle('Last Page'));
        expect(handlePageChange).toHaveBeenCalledWith(10);
    });

    it('disables buttons at boundaries', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={() => { }} />);
        expect(screen.getByTitle('First Page')).toBeDisabled();
        expect(screen.getByTitle('Previous Page')).toBeDisabled();
        expect(screen.getByTitle('Next Page')).not.toBeDisabled();
        expect(screen.getByTitle('Last Page')).not.toBeDisabled();

        cleanup();
        render(<Pagination currentPage={5} totalPages={5} onPageChange={() => { }} />);
        expect(screen.getByTitle('Next Page')).toBeDisabled();
        expect(screen.getByTitle('Last Page')).toBeDisabled();
    });

    it('does not render scenarios with 1 or 0 pages', () => {
        const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={() => { }} />);
        expect(container).toBeEmptyDOMElement();
    });
});
