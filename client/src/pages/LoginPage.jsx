import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import CenteredLayout from '../layouts/CenteredLayout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
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
        <CenteredLayout>
            <Card className={styles.loginCard}>
                <CardHeader>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to continue</p>
                </CardHeader>
                <CardBody>
                    <LoginForm onSuccess={handleLoginSuccess} />
                </CardBody>
            </Card>
        </CenteredLayout>
    );
};

export default LoginPage;
