import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Buttons';
import styles from './LoginForm.module.css';
import { useState } from 'react';

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
                <div className={styles.inputGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>
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
