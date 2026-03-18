import React from 'react';
import LoginModal from './LoginModal';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Auth/LoginModal',
    component: LoginModal,
    decorators: [
        (Story, context) => (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <button 
                    popovertarget="login-popover"
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--color-brand-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}
                >
                    Open Login Modal
                </button>
                {withAppProviders(() => <Story {...context.args} />, context)}
            </div>
        )
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export const LoggedOut = {
    parameters: {
        mockData: {
            user: null
        }
    }
};

export const LoggedIn = {
    parameters: {
        mockData: {
            user: { username: 'jdoe', role: 'admin' }
        }
    }
};
