import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/form/Input';
import styles from './Setup.module.css';

const Setup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { needsSetup, checkSetup, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If setup not needed, go home
        if (!needsSetup) {
            navigate('/');
        }
    }, [needsSetup, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                await checkSetup();
                const authRes = await login(username, password);
                if (authRes.success) {
                    navigate('/admin');
                }
            } else {
                const data = await res.json();
                setError(data.message || 'Setup failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Initial System Setup</h1>
            <p>Create the primary administrator account.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p className={styles.error}>{error}</p>}

                <Button type="submit" disabled={isLoading} className={styles.submitBtn}>
                    {isLoading ? 'Creating Admin...' : 'Finish Setup'}
                </Button>
            </form>
        </div>
    );
};

export default Setup;
