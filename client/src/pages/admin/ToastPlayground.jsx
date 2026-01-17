import React from 'react';
import { useToast } from '../../context/ToastContext';
import styles from './ToastPlayground.module.css';

const ToastPlayground = () => {
    const { addToast } = useToast();

    return (
        <div className={styles.container}>
            <h2>Toast System Testing</h2>
            <p>Use the buttons below to trigger different toast notifications.</p>

            <div className={styles.buttonGrid}>
                <button
                    className={`${styles.testBtn} ${styles.success}`}
                    onClick={() => addToast('Successfully updated the database!', 'success')}
                >
                    Trigger Success
                </button>

                <button
                    className={`${styles.testBtn} ${styles.error}`}
                    onClick={() => addToast('Failed to connect to server.', 'error')}
                >
                    Trigger Error
                </button>

                <button
                    className={`${styles.testBtn} ${styles.warning}`}
                    onClick={() => addToast('Warning: Your session will expire soon.', 'warning')}
                >
                    Trigger Warning
                </button>

                <button
                    className={`${styles.testBtn} ${styles.info}`}
                    onClick={() => addToast('Fun fact: This app uses SWR caching!', 'info')}
                >
                    Trigger Info
                </button>

                <button
                    className={`${styles.testBtn} ${styles.sticky}`}
                    onClick={() => addToast('This toast will stay until you close it.', 'info', { autoHide: false })}
                >
                    Trigger Persistent Info
                </button>
            </div>
        </div>
    );
};

export default ToastPlayground;
