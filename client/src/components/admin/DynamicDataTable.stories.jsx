import React from 'react';
import DynamicDataTable from './DynamicDataTable';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Admin/DynamicDataTable',
    component: DynamicDataTable,
    decorators: [withAppProviders],
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

const mockType = {
    _id: 'type-1',
    name: 'Products',
    description: 'Manage your store products here.',
    isOrdered: true,
    fields: [
        { name: 'name', type: 'text', required: true, description: 'Product title' },
        { name: 'price', type: 'number', required: true },
        { name: 'inStock', type: 'boolean' },
        { name: 'category', type: 'radio', options: ['electronics', 'clothing', 'home'] },
    ],
    permissions: {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canReorder: true
    }
};

export const Default = {
    args: {
        type: mockType
    },
    parameters: {
        mockData: {
            initialData: {
                '/data/entities/type-1?page=1&limit=10': {
                    data: [
                        { _id: 'row-1', name: 'Smartphone', price: 999, inStock: true, category: 'electronics' },
                        { _id: 'row-2', name: 'Coffee Maker', price: 49, inStock: false, category: 'home' },
                        { _id: 'row-3', name: 'T-Shirt', price: 25, inStock: true, category: 'clothing' },
                    ],
                    totalPages: 1
                }
            }
        }
    }
};

export const ReadOnly = {
    args: {
        type: {
            ...mockType,
            permissions: {
                canAdd: false,
                canEdit: false,
                canDelete: false,
                canReorder: false
            }
        }
    },
    parameters: {
        ...Default.parameters
    }
};
