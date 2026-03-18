import React from 'react';
import Header from './Header';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Layout/Header',
    component: Header,
    decorators: [withAppProviders],
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Default = {
    parameters: {
        mockData: {
            user: null,
            meta: { title: 'Standard Admin', logo: null }
        }
    }
};

export const LoggedIn = {
    parameters: {
        mockData: {
            user: { username: 'jdoe', role: 'admin' },
            meta: { title: 'Standard Admin', logo: null }
        }
    }
};

export const CustomLogo = {
    parameters: {
        mockData: {
            user: null,
            meta: { 
                title: 'Brand CMS', 
                logo: 'https://placehold.co/120x40/6366f1/ffffff?text=LOGO' 
            }
        }
    }
};
