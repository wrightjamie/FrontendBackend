/**
 * @file Card.test.jsx
 * @description Unit tests for the Card component and its sub-components (Header, Body, Footer).
 * 
 * @tests
 * 1. Renders Card with children.
 * 2. Applies 'dense' styling when prop is provided.
 * 3. Renders CardHeader, CardBody, and CardFooter with children.
 * 4. Passes through custom classNames and additional props.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import React from 'react';

// Mock the CSS module
vi.mock('./Card.module.css', () => ({
    default: {
        card: 'card',
        dense: 'dense',
        header: 'header',
        body: 'body',
        footer: 'footer'
    }
}));

describe('Card', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders Card with children and default classes', () => {
        render(<Card>Card Content</Card>);
        const card = screen.getByText('Card Content');
        expect(card).toHaveClass('card');
        expect(card).not.toHaveClass('dense');
    });

    it('applies dense class when dense prop is true', () => {
        render(<Card dense>Dense Content</Card>);
        const card = screen.getByText('Dense Content');
        expect(card).toHaveClass('dense');
    });

    it('renders sub-components correctly', () => {
        render(
            <Card>
                <CardHeader>Header</CardHeader>
                <CardBody>Body</CardBody>
                <CardFooter>Footer</CardFooter>
            </Card>
        );
        expect(screen.getByText('Header')).toHaveClass('header');
        expect(screen.getByText('Body')).toHaveClass('body');
        expect(screen.getByText('Footer')).toHaveClass('footer');
    });

    it('passes through custom className and props', () => {
        render(<Card className="custom-class" data-testid="card-test">Content</Card>);
        const card = screen.getByTestId('card-test');
        expect(card).toHaveClass('custom-class');
    });
});
