import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../components/auth/ChangePassword';
import CenteredLayout from '../layouts/CenteredLayout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import styles from './ForcePasswordChange.module.css';

/**
 * ForcePasswordChange: Page shown when a user MUST change their password
 * before accessing any other part of the application.
 */
const ForcePasswordChange = () => {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async () => {
        // Refresh user data to clear the mustResetPassword flag in AuthContext
        await refreshUser();
        // Redirect to home
        navigate('/');
    };

    return (
        <CenteredLayout>
            <Card className={styles.card}>
                <CardHeader>
                    <h1>Security Update Required</h1>
                    <p>An administrator has reset your password. You must choose a new password before continuing.</p>
                </CardHeader>
                <CardBody>
                    <ChangePassword onSuccess={handleSuccess} />
                </CardBody>
            </Card>
        </CenteredLayout>
    );
};

export default ForcePasswordChange;
