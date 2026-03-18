import React from 'react';
import ImageSelect from './ImageSelect';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Form/ImageSelect',
    component: ImageSelect,
    decorators: [withAppProviders],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Empty = {
    args: {
        label: 'Featured Image',
        value: '',
        onChange: (val) => console.log('Image Selected:', val),
    },
    parameters: {
        mockData: {
            initialData: {
                '/upload': [
                    { _id: '1', url: 'https://placehold.co/400x300/6366f1/ffffff?text=Img+1', title: 'Image 1' },
                    { _id: '2', url: 'https://placehold.co/400x300/a855f7/ffffff?text=Img+2', title: 'Image 2' },
                    { _id: '3', url: 'https://placehold.co/400x300/ec4899/ffffff?text=Img+3', title: 'Image 3' },
                ]
            }
        }
    }
};

export const WithValue = {
    args: {
        ...Empty.args,
        value: 'https://placehold.co/400x300/6366f1/ffffff?text=Selected+Image',
    },
    parameters: {
        ...Empty.parameters
    }
};
