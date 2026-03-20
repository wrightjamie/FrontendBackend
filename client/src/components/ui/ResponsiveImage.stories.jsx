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
        image: {
            url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop',
            title: 'Sample Image',
            variants: {
                sm: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&auto=format&fit=crop',
                md: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&auto=format&fit=crop',
                lg: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop',
            }
        },
        alt: 'Example Image',
        sizes: '(max-width: 600px) 100vw, 50vw',
    },
};
