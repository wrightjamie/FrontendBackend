/**
 * @file TabNavigation.test.jsx
 * @description Unit tests for the TabNavigation component.
 * 
 * @tests
 * 1. Renders tabs with labels.
 * 2. Routing Mode: Renders NavLinks with correct paths.
 * 3. State Mode: Renders buttons and calls onTabClick.
 * 4. Applies active class correctly in state mode.
 * 5. Renders tab icons when provided.
 * 6. Applies variant classes (underline, pill).
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import TabNavigation from './TabNavigation';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock the CSS module
vi.mock('./TabNavigation.module.css', () => ({
    default: {
        tabsContainer: 'tabsContainer',
        tab: 'tab',
        underline: 'underline',
        pill: 'pill',
        active: 'active',
        icon: 'icon'
    }
}));

const mockTabs = [
    { label: 'Home', path: '/', value: 'home', icon: <span data-testid="home-icon">🏠</span> },
    { label: 'Profile', path: '/profile', value: 'profile' },
    { label: 'Settings', path: '/settings', value: 'settings' }
];

const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('TabNavigation', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders tabs with labels', () => {
        renderWithRouter(<TabNavigation tabs={mockTabs} />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('routing mode: renders NavLinks with paths', () => {
        renderWithRouter(<TabNavigation tabs={mockTabs} />);
        const homeLink = screen.getByRole('link', { name: /home/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('state mode: renders buttons and handles clicks', () => {
        const onTabClick = vi.fn();
        render(<TabNavigation tabs={mockTabs} onTabClick={onTabClick} activeTab="/" />);

        const profileBtn = screen.getByRole('button', { name: /profile/i });
        fireEvent.click(profileBtn);
        expect(onTabClick).toHaveBeenCalledWith('/profile');

        const homeBtn = screen.getByRole('button', { name: /home/i });
        expect(homeBtn).toHaveClass('active');
    });

    it('renders icons when provided', () => {
        render(<TabNavigation tabs={mockTabs} onTabClick={() => { }} />);
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        const { container } = render(<TabNavigation tabs={mockTabs} onTabClick={() => { }} variant="pill" />);
        const tab = container.querySelector('button');
        expect(tab).toHaveClass('pill');
    });
});
