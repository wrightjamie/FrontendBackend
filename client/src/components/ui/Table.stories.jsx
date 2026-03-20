import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from './Table';

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
    render: () => (
        <Table>
            <Thead>
                <Tr>
                    {columns.map(col => <Th key={col.key}>{col.header}</Th>)}
                </Tr>
            </Thead>
            <Tbody>
                {data.map(row => (
                    <Tr key={row.id}>
                        {columns.map(col => <Td key={col.key}>{row[col.key]}</Td>)}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    ),
};

export const Empty = {
    render: () => (
        <Table>
            <Thead>
                <Tr>
                    {columns.map(col => <Th key={col.key}>{col.header}</Th>)}
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td colSpan={columns.length} style={{ textAlign: 'center' }}>No data available</Td>
                </Tr>
            </Tbody>
        </Table>
    ),
};
