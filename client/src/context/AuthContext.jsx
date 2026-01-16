import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed', err);
        } finally {
            setLoading(false);
        }
    };

    const checkSetup = async () => {
        try {
            const res = await fetch('/api/auth/needs-setup');
            const data = await res.json();
            setNeedsSetup(data.needsSetup);
        } catch (err) {
            console.error('Setup check failed', err);
        }
    };

    useEffect(() => {
        checkAuth();
        checkSetup();
    }, []);

    const login = async (username, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            return { success: true };
        } else {
            const error = await res.json();
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    const value = {
        user,
        loading,
        needsSetup,
        login,
        logout,
        checkAuth,
        checkSetup
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
