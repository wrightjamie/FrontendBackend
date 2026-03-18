import React from 'react';
import ImageUpload from './ImageUpload';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Form/ImageUpload',
    component: ImageUpload,
    decorators: [withAppProviders],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'Product Image',
        onUpload: (results) => console.log('Upload Success:', results),
    }
};

export const WithInitialImage = {
    args: {
        ...Default.args,
        currentImage: 'https://placehold.co/400x300/6366f1/ffffff?text=Existing+Image',
    }
};

export const MultiFileUpload = {
    args: {
        ...Default.args,
        multiple: true,
        label: 'Upload Multiple Gallery Images',
    }
};
