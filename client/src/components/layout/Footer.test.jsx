/**
 * @file Footer.test.jsx
 * @description Unit tests for the Footer component.
 * 
 * @tests
 * 1. Renders footer with copyright text.
 * 2. Displays current year.
 * 3. Displays site title from metadata.
 * 4. Renders footer links.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import Footer from './Footer';
import React from 'react';

// Mock the CSS module
vi.mock('./Footer.module.css', () => ({
    default: {
        footer: 'footer',
        container: 'container',
        links: 'links'
    }
}));

// Mock useSiteMeta hook
let mockMeta = { title: 'Test Site' };
vi.mock('../../hooks/useSiteMeta', () => ({
    useSiteMeta: () => ({
        meta: mockMeta
    })
}));

describe('Footer', () => {
    beforeEach(() => {
        mockMeta = { title: 'Test Site' };
    });

    afterEach(() => {
        cleanup();
    });

    it('renders footer with copyright text', () => {
        render(<Footer />);

        expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
    });

    it('displays current year', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });

    it('displays site title from metadata', () => {
        mockMeta = { title: 'My Awesome Site' };
        render(<Footer />);

        expect(screen.getByText(/my awesome site/i)).toBeInTheDocument();
    });

    it('renders privacy link', () => {
        render(<Footer />);

        const privacyLink = screen.getByText(/privacy/i);
        expect(privacyLink).toBeInTheDocument();
        expect(privacyLink).toHaveAttribute('href', '#');
    });

    it('renders terms link', () => {
        render(<Footer />);

        const termsLink = screen.getByText(/terms/i);
        expect(termsLink).toBeInTheDocument();
        expect(termsLink).toHaveAttribute('href', '#');
    });

    it('renders support link', () => {
        render(<Footer />);

        const supportLink = screen.getByText(/support/i);
        expect(supportLink).toBeInTheDocument();
        expect(supportLink).toHaveAttribute('href', '#');
    });

    it('renders all three footer links', () => {
        const { container } = render(<Footer />);

        const links = container.querySelectorAll('a');
        expect(links).toHaveLength(3);
    });
});
