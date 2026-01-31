import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/form/Input';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSuccess, onRegisterClick }) => {
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
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}
                <Input
                    id="username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    icon={User}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    icon={Lock}
                />
                <Button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>
            <div className={styles.footer}>
                <p>
                    Don't have an account?
                    <Link to="/register" className={styles.link} onClick={onRegisterClick}>Register</Link>
                </p>
            </div>
        </>
    );
};

export default LoginForm;
