import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import styles from './Toast.module.css';

const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <div className={styles.toastContainer}>
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
