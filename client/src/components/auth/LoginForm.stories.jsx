import React from 'react';
import LoginForm from './LoginForm';
import { withAppProviders } from '../../stories/MockAppDecorator';

export default {
    title: 'Auth/LoginForm',
    component: LoginForm,
    decorators: [withAppProviders],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        onSuccess: () => console.log('Login Success!'),
        onRegisterClick: (e) => {
            e.preventDefault();
            console.log('Register Clicked!');
        }
    }
};

export const Loading = {
    args: {
        ...Default.args,
    },
    parameters: {
        // We can't easily force the internal loading state without props,
        // but we could mock the login function to be slow if AuthContext supported it.
        docs: {
            description: {
                story: 'Internal loading state is managed by the component during submission.',
            },
        },
    }
};
