import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the return path from location state, defaulting to /admin
    const from = location.state?.from?.pathname || '/admin';

    useEffect(() => {
        // If already logged in, redirect away from login page
        if (!loading && user) {
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, from]);

    const handleLoginSuccess = () => {
        navigate(from, { replace: true });
    };

    if (loading) return <div className={styles.loading}>Checking authentication...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to continue</p>
                </div>
                <LoginForm onSuccess={handleLoginSuccess} />
                <div className={styles.footer}>
                    <p>Need help? Contact your administrator.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
