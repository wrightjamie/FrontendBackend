import React from 'react';
import Pagination from './Pagination';

export default {
    title: 'UI/Pagination',
    component: Pagination,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        currentPage: 1,
        totalPages: 10,
        onPageChange: (page) => console.log('Page changed to:', page),
    },
};

export const MiddlePage = {
    args: {
        currentPage: 5,
        totalPages: 10,
        onPageChange: (page) => console.log('Page changed to:', page),
    },
};

export const LastPage = {
    args: {
        currentPage: 10,
        totalPages: 10,
        onPageChange: (page) => console.log('Page changed to:', page),
    },
};
