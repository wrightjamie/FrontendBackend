import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import TabNavigation from './TabNavigation';
import { Settings, User, Bell } from 'lucide-react';

export default {
    title: 'UI/TabNavigation',
    component: TabNavigation,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <div style={{ minWidth: '400px' }}>
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['underline', 'pill'],
            description: 'Style variant of the tabs',
        },
    },
};

export const UnderlineWithRoutes = {
    args: {
        variant: 'underline',
        tabs: [
            { path: '/profile', label: 'Profile' },
            { path: '/account', label: 'Account' },
            { path: '/notifications', label: 'Notifications' },
        ],
    },
};

export const PillWithIcons = {
    args: {
        variant: 'pill',
        tabs: [
            { value: 'settings', label: 'Settings', icon: <Settings size={18} /> },
            { value: 'user', label: 'User', icon: <User size={18} /> },
            { value: 'alerts', label: 'Alerts', icon: <Bell size={18} /> },
        ],
        activeTab: 'user',
        onTabClick: (value) => console.log('Tab clicked:', value),
    },
    parameters: {
        docs: {
            description: {
                story: 'This story uses the state mode (`onTabClick` and `activeTab`) instead of React Router paths.',
            },
        },
    },
};
