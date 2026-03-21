import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { DataContext, DataProvider } from '../context/DataContext';
import { ToastContext, ToastProvider } from '../context/ToastContext';
import { ModalProvider } from '../context/ModalContext';

/**
 * MockAppDecorator: A Storybook decorator that provides all necessary 
 * application contexts with mocked data/state.
 */
export const withAppProviders = (Story, context) => {
    // Extraction of custom story parameters for mocking
    const { 
        user = null, 
        meta = { title: 'Storybook CMS', logo: null },
        initialData = {}
    } = context.parameters?.mockData || {};

    // Combine site meta into initialData for DataProvider
    const fullInitialData = {
        '/site/meta': meta,
        ...initialData
    };

    // Global fetch mock for Storybook
    React.useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
            const endpoint = url.replace('/api', '');
            
            // Handle GET requests using initialData
            if (!options?.method || options.method === 'GET') {
                const data = fullInitialData[endpoint];
                if (data) {
                    return {
                        ok: true,
                        json: async () => data,
                        headers: { get: () => 'application/json' }
                    };
                }
            }

            // Handle mutations (POST, PUT, DELETE) - always succeed in mock
            return {
                ok: true,
                json: async () => ({ success: true, results: [{ url: 'https://placehold.co/100', filename: 'mock.png' }] }),
                headers: { get: () => 'application/json' }
            };
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [fullInitialData]);

    return (
        <DataProvider initialData={fullInitialData}>
            <ToastProvider>
                <ModalProvider>
                    <MemoryRouter>
                        <MockAuthProvider user={user}>
                            <div className="storybook-wrapper">
                                <Story />
                            </div>
                        </MockAuthProvider>
                    </MemoryRouter>
                </ModalProvider>
            </ToastProvider>
        </DataProvider>
    );
};

// Internal simplified AuthProvider for Storybook mocking
const MockAuthProvider = ({ children, user }) => {
    const value = {
        user,
        loading: false,
        needsSetup: false,
        login: async () => ({ success: true }),
        logout: async () => console.log('Mock Logout'),
        checkAuth: async () => {},
        refreshUser: async () => {},
        checkSetup: async () => {}
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
