import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
                <div>
                    <label className={styles.inputLabel}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <label className={styles.inputLabel}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <label className={styles.inputLabel}>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Admin...' : 'Finish Setup'}
                </button>
            </form>
        </div>
    );
};

export default Setup;
