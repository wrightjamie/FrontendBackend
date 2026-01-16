import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal = () => {
    const { user, login, logout } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (username && password) {
            const res = await login(username, password);
            if (res.success) {
                document.getElementById('login-popover').hidePopover();
                setUsername('');
                setPassword('');
            } else {
                setError(res.message || 'Login failed');
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        document.getElementById('login-popover').hidePopover();
    };

    const isLoggedIn = !!user;
    const currentUsername = user?.username;

    return (
        <div
            id="login-popover"
            popover="auto"
            className={styles.popover}
        >
            {isLoggedIn ? (
                <div className={styles.form}>
                    <h3>Hello, {currentUsername || 'User'}</h3>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>Login</h3>
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
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        Sign In
                    </button>
                </form>
            )}
        </div>
    );
};

export default LoginModal;
