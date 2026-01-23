import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import styles from './LoginModal.module.css';

const LoginModal = () => {
    const { user, logout } = useAuth();

    const closeModal = () => {
        document.getElementById('login-popover').hidePopover();
    };

    const handleLogout = async () => {
        await logout();
        closeModal();
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
                    <Link to="/profile" className={styles.profileLink} onClick={closeModal}>
                        My Profile
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            ) : (
                <div className={styles.form}>
                    <h3>Login</h3>
                    <LoginForm onSuccess={closeModal} onRegisterClick={closeModal} />
                </div>
            )}
        </div>
    );
};

export default LoginModal;
