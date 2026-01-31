import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import { Button } from '../ui/Button';
import { Popover } from '../ui/Popover';
import { LayoutDashboard, User as UserIcon, LogOut } from 'lucide-react';
import styles from './LoginModal.module.css';

const LoginModal = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
        <Popover
            id="login-popover"
            className={styles.popover}
        >
            {isLoggedIn ? (
                <div className={styles.form}>
                    <h3>Hello, {currentUsername || 'User'}</h3>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className={styles.profileLink} onClick={closeModal}>
                            <LayoutDashboard size={16} />
                            <span>Admin Dashboard</span>
                        </Link>
                    )}
                    <Link to="/profile" className={styles.profileLink} onClick={closeModal}>
                        <UserIcon size={16} />
                        <span>My Profile</span>
                    </Link>
                    <div className={`${styles.profileLink} ${styles.logoutLink}`} onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </div>
                </div>
            ) : (
                <div className={styles.form}>
                    <h3>Login</h3>
                    <LoginForm onSuccess={closeModal} onRegisterClick={closeModal} />
                </div>
            )}
        </Popover>
    );
};

export default LoginModal;
