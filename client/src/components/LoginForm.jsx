import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSuccess }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (username && password) {
                const res = await login(username, password);
                if (res.success) {
                    setUsername('');
                    setPassword('');
                    if (onSuccess) onSuccess();
                } else {
                    setError(res.message || 'Login failed');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.inputGroup}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
};

export default LoginForm;
