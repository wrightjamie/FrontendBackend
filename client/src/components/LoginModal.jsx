import React, { useState } from 'react';
import styles from './LoginModal.module.css';

const LoginModal = ({ isLoggedIn, onLogin, onLogout }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) {
            onLogin(username);
            // Close popover manually if needed, but normally toggle handles it or we hide it.
            // With popover API, it stays open until dismissed or toggled. 
            // We can find the popover and hide it, or just rely on user interaction.
            // For a better UX, we should likely close it on success.
            document.getElementById('login-popover').hidePopover();
        }
    };

    const handleLogout = () => {
        onLogout();
        document.getElementById('login-popover').hidePopover();
    };

    return (
        <div
            id="login-popover"
            popover="auto"
            className={styles.popover}
        >
            {isLoggedIn ? (
                <div className={styles.form}>
                    <h3>Hello, {username || 'User'}</h3>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>Login</h3>
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
