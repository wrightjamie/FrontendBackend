/**
 * @file Popover.test.jsx
 * @description Unit tests for the Popover component.
 * 
 * @tests
 * 1. Renders Popover with children.
 * 2. Applies the 'popover' attribute as 'auto'.
 * 3. Passes through ID and custom classNames.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Popover } from './Popover';
import React from 'react';

// Mock the CSS module
vi.mock('./Popover.module.css', () => ({
    default: {
        popover: 'popover'
    }
}));

describe('Popover', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders Popover with children', () => {
        render(<Popover id="test-popover">Popover Content</Popover>);
        const popover = screen.getByText('Popover Content');
        expect(popover).toBeInTheDocument();
        expect(popover).toHaveAttribute('id', 'test-popover');
        expect(popover).toHaveAttribute('popover', 'auto');
        expect(popover).toHaveClass('popover');
    });

    it('passes through custom className', () => {
        render(<Popover className="custom-pop">Content</Popover>);
        const popover = screen.getByText('Content');
        expect(popover).toHaveClass('custom-pop');
    });
});
