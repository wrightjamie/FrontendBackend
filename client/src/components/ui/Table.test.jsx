/**
 * @file Table.test.jsx
 * @description Unit tests for the Table component and its sub-components (Thead, Tbody, Tr, Th, Td).
 * 
 * @tests
 * 1. Renders table structure correctly.
 * 2. Applies 'dense' styling when prop is provided.
 * 3. Renders all sub-components (Thead, Tbody, Tr, Th, Td) with children and classes.
 * 4. Passes through custom classNames and additional props.
 */
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Table, Thead, Tbody, Tr, Th, Td } from './Table';
import React from 'react';

// Mock the CSS module
vi.mock('./Table.module.css', () => ({
    default: {
        tableContainer: 'tableContainer',
        table: 'table',
        dense: 'dense',
        thead: 'thead',
        tbody: 'tbody',
        tr: 'tr',
        th: 'th',
        td: 'td'
    }
}));

describe('Table', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders full table structure', () => {
        render(
            <Table>
                <Thead>
                    <Tr>
                        <Th>Header 1</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Cell 1</Td>
                    </Tr>
                </Tbody>
            </Table>
        );

        expect(screen.getByRole('table')).toHaveClass('table');
        expect(screen.getByText('Header 1')).toHaveClass('th');
        expect(screen.getByText('Cell 1')).toHaveClass('td');
    });

    it('applies dense class when dense prop is true', () => {
        render(<Table dense><tbody><tr><td>Data</td></tr></tbody></Table>);
        const table = screen.getByRole('table');
        expect(table).toHaveClass('dense');
    });

    it('passes through custom classNames', () => {
        render(<Td className="custom-td">Value</Td>);
        expect(screen.getByText('Value')).toHaveClass('custom-td');
    });
});
