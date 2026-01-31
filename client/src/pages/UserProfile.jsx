import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/apiClient';
import ChangePassword from '../components/auth/ChangePassword';
import { Button } from '../components/ui/Button';
import styles from './UserProfile.module.css';
import { User, ShieldCheck, Mail, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * UserProfile: User profile page for managing personal information
 * Accessible to all logged-in users
 */
const UserProfile = () => {
    const { user, refreshUser, logout } = useAuth(); // Added logout from useAuth
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setIsDirty(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient('/auth/profile', {
                method: 'PUT',
                body: {
                    name: formData.name,
                    email: formData.email
                }
            });

            addToast('Profile updated successfully!', 'success');
            setIsDirty(false);
            refreshUser(); // Refresh user data in context
        } catch (err) {
            addToast(err.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChangeSuccess = () => {
        addToast('Password changed successfully!', 'success');
    };

    const handleLogout = () => {
        logout();
        addToast('Logged out successfully!', 'info');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>
                    <User size={32} />
                    <span>My Profile</span>
                </h1>
                <p>Manage your personal information and security settings</p>
            </div>

            <div className={styles.section}>
                <h2>
                    <User size={20} />
                    <span>Personal Information</span>
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className={styles.input}
                            value={formData.username}
                            disabled
                            title="Username cannot be changed"
                        />
                        <span className={styles.hint}>Username cannot be changed</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className={styles.input}
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={!isDirty || loading}
                            intent="primary" // Added intent
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className={styles.separator}></div>

            <div className={styles.section}>
                <h2>
                    <ShieldCheck size={20} />
                    <span>Security</span>
                </h2>
                <ChangePassword onSuccess={handlePasswordChangeSuccess} />
            </div>
        </div>
    );
};

export default UserProfile;
