import React from 'react';
import { Table } from './Table';

export default {
    title: 'UI/Table',
    component: Table,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
];

const data = [
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'Editor' },
    { id: 3, name: 'Charlie', role: 'Viewer' },
];

export const Default = {
    args: {
        columns,
        data,
    },
};

export const Empty = {
    args: {
        columns,
        data: [],
    },
};
