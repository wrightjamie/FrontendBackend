/**
 * @file DynamicDataTable.test.jsx
 * @description Unit tests for the DynamicDataTable component.
 * 
 * @tests
 * 1. Renders table with provided data.
 * 2. Displays loading state when data is fetching.
 * 3. Opens "Add Record" form and renders inputs.
 * 4. Calls 'create' mutation on save.
 * 5. Calls 'delete' mutation and confirms action.
 * 6. Mocks custom data hooks (useDataEntities, useDynamicDataMutations).
 */
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import DynamicDataTable from './DynamicDataTable';
import React from 'react';

// Mock dependencies
vi.mock('../../hooks/useDynamicData', () => ({
    useDataEntities: vi.fn(),
    useDynamicDataMutations: vi.fn()
}));

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

// Mock CSS
vi.mock('./DynamicDataTable.module.css', () => ({
    default: {
        container: 'container',
        header: 'header',
        tableWrapper: 'tableWrapper',
        actions: 'actions',
        editRow: 'editRow',
        loading: 'loading'
    }
}));

import { useDataEntities, useDynamicDataMutations } from '../../hooks/useDynamicData';

describe('DynamicDataTable', () => {
    const mockType = {
        _id: 'users',
        name: 'Users',
        description: 'Manage users',
        fields: [
            { name: 'username', type: 'text', required: true },
            { name: 'role', type: 'text' }
        ],
        permissions: {
            canAdd: true,
            canEdit: true,
            canDelete: true,
            canReorder: false
        },
        isOrdered: false
    };

    const mockData = [
        { _id: '1', username: 'alice', role: 'admin' },
        { _id: '2', username: 'bob', role: 'user' }
    ];

    const mockMutations = {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        reorder: vi.fn()
    };

    beforeEach(() => {
        useDynamicDataMutations.mockReturnValue(mockMutations);
        useDataEntities.mockReturnValue({
            data: { data: mockData, totalPages: 1 },
            loading: false,
            refresh: vi.fn()
        });
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders table with data', () => {
        render(<DynamicDataTable type={mockType} />);

        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('alice')).toBeInTheDocument();
        expect(screen.getByText('bob')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        useDataEntities.mockReturnValue({
            data: [],
            loading: true,
            refresh: vi.fn()
        });

        render(<DynamicDataTable type={mockType} />);
        expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('opens add form when Add Record is clicked', () => {
        render(<DynamicDataTable type={mockType} />);

        const addBtn = screen.getByText('Add Record');
        fireEvent.click(addBtn);

        // Should show input fields
        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBeGreaterThan(0);

        // Should show Save and Cancel buttons
        expect(screen.getByTitle('Save')).toBeInTheDocument();
        expect(screen.getByTitle('Cancel')).toBeInTheDocument();
    });

    it('calls create mutation on save', async () => {
        mockMutations.create.mockResolvedValue({ success: true });

        render(<DynamicDataTable type={mockType} />);

        fireEvent.click(screen.getByText('Add Record'));

        // Fill form - finding inputs by placeholder or id could be tricky without labels
        // But renderInput uses id={`field-${field.name}-${index}`} and index is 999 for add
        // So id="field-username-999"

        // We can use container.querySelector to find input by id if getByLabelText fails (no label rendered in table usually)
        // Or get all inputs

        // Let's assume input order follows fields
        const inputs = screen.getAllByRole('textbox');
        fireEvent.change(inputs[0], { target: { value: 'charlie' } }); // username

        const saveBtn = screen.getByTitle('Save');
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(mockMutations.create).toHaveBeenCalledWith(expect.objectContaining({
                username: 'charlie'
            }));
        });
    });

    it('calls delete mutation on delete click', async () => {
        mockMutations.delete.mockResolvedValue({ success: true });
        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

        render(<DynamicDataTable type={mockType} />);

        const deleteBtns = screen.getAllByTitle('Delete');
        fireEvent.click(deleteBtns[0]); // Delete alice

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
            expect(mockMutations.delete).toHaveBeenCalledWith('1');
        });

        confirmSpy.mockRestore();
    });
});
