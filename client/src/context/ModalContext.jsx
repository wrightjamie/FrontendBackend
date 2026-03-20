import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConfirmDialog } from '../components/ui/Modal/ConfirmDialog';
import { PromptDialog } from '../components/ui/Modal/PromptDialog';

export const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within a ModalProvider');
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setModals((prev) => [
                ...prev,
                { id: Math.random().toString(36).substr(2, 9), type: 'confirm', options, resolve }
            ]);
        });
    }, []);

    const prompt = useCallback((options) => {
        return new Promise((resolve) => {
            setModals((prev) => [
                ...prev,
                { id: Math.random().toString(36).substr(2, 9), type: 'prompt', options, resolve }
            ]);
        });
    }, []);

    const closeModal = useCallback((id, result) => {
        setModals((prev) => {
            const modalIndex = prev.findIndex((m) => m.id === id);
            if (modalIndex !== -1) {
                const modal = prev[modalIndex];
                // Resolve the promise
                modal.resolve(result);
                // Remove this modal from the queue
                const newModals = [...prev];
                newModals.splice(modalIndex, 1);
                return newModals;
            }
            return prev;
        });
    }, []);

    const currentModal = modals[0] || null;

    return (
        <ModalContext.Provider value={{ confirm, prompt }}>
            {children}
            {currentModal && currentModal.type === 'confirm' && (
                <ConfirmDialog
                    key={currentModal.id}
                    {...currentModal.options}
                    onClose={(result) => closeModal(currentModal.id, result)}
                />
            )}
            {currentModal && currentModal.type === 'prompt' && (
                <PromptDialog
                    key={currentModal.id}
                    {...currentModal.options}
                    onClose={(result) => closeModal(currentModal.id, result)}
                />
            )}
        </ModalContext.Provider>
    );
};
