import React from 'react';
import ResponsiveImage from './ResponsiveImage';
import { DataProvider } from '../../context/DataContext';

export default {
    title: 'UI/ResponsiveImage',
    component: ResponsiveImage,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <DataProvider>
                <Story />
            </DataProvider>
        ),
    ],
    tags: ['autodocs'],
};

export const Default = {
    args: {
        mediaId: '123',
        alt: 'Example Image',
        sizes: '(max-width: 600px) 100vw, 50vw',
        srcFallback: 'https://via.placeholder.com/800x600',
    },
};
