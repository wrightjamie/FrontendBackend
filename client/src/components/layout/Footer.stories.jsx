import React from 'react';
import Footer from './Footer';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Layout/Footer',
    component: Footer,
    decorators: [withAppProviders],
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Default = {
    parameters: {
        mockData: {
            meta: { title: 'Standard Admin' }
        }
    }
};
