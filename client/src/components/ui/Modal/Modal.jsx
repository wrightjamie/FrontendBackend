import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './Modal.module.css';
import { X } from 'lucide-react';

export const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    closeOnBackdrop = true,
    maxWidth = '500px'
}) => {
    const dialogRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const triggerRef = useRef(null);

    // Sync React state with imperative <dialog> API
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            // Save currently active element to return focus later
            triggerRef.current = document.activeElement;
            setIsClosing(false);
            if (!dialog.open) {
                dialog.showModal();
            }
        } else if (dialog.open && !isClosing) {
            // If isOpen becomes false externally, handle animated close
            handleClose();
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        // Wait for CSS animation to finish
        setTimeout(() => {
            const dialog = dialogRef.current;
            if (dialog?.open) {
                dialog.close();
            }
            setIsClosing(false);
            onClose();
            // Restore focus
            if (triggerRef.current) {
                triggerRef.current.focus();
            }
        }, 200); // Matches CSS transition duration
    }, [onClose]);

    // Handle ESC key
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleCancel = (e) => {
            e.preventDefault(); // Prevent immediate closing
            handleClose(); // Trigger animated close instead
        };

        dialog.addEventListener('cancel', handleCancel);
        return () => dialog.removeEventListener('cancel', handleCancel);
    }, [handleClose]);

    // Handle Backdrop Click
    const handleBackdropClick = (e) => {
        if (!closeOnBackdrop) return;
        
        const dialog = dialogRef.current;
        if (!dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom &&
            e.clientX >= rect.left &&
            e.clientX <= rect.right
        );

        if (!isInDialog) {
            handleClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className={`${styles.dialog} ${isClosing ? styles.closing : ''}`}
            onClick={handleBackdropClick}
            style={{ maxWidth }}
        >
            <div className={styles.content}>
                {title && (
                    <div className={styles.header}>
                        <h2 className={styles.title}>{title}</h2>
                        <button 
                            className={styles.closeButton} 
                            onClick={handleClose}
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
                <div className={styles.body}>{children}</div>
                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </dialog>
    );
};
