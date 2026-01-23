import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import styles from './ChangePassword.module.css';

/**
 * ChangePassword: Component for users to change their own password
 * Can be embedded in settings page or used as a standalone modal
 */
const ChangePassword = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            setLoading(false);
            return;
        }

        try {
            await apiClient('/auth/change-password', {
                method: 'POST',
                body: {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            });

            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            if (onSuccess) {
                setTimeout(() => onSuccess(), 1500);
            }
        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Password Changed Successfully</h3>
                <p>Your password has been updated.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3>Change Password</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.inputGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        className={styles.input}
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className={styles.input}
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={6}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className={styles.input}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={6}
                    />
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                    {onCancel && (
                        <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
