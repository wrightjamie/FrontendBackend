import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        // Cleanup timer if it exists
        if (timers.current.has(id)) {
            clearTimeout(timers.current.get(id));
            timers.current.delete(id);
        }
    }, []);

    const addToast = useCallback((message, type = 'info', options = {}) => {
        const id = Math.random().toString(36).substr(2, 9);
        const { duration = 5000, autoHide = true } = options;

        const newToast = { id, message, type, autoHide };
        setToasts(prev => [...prev, newToast]);

        if (autoHide) {
            const timerId = setTimeout(() => {
                removeToast(id);
            }, duration);
            timers.current.set(id, timerId);
        }

        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
            {children}
        </ToastContext.Provider>
    );
};
