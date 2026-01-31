import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/form/Input';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = formData;
            const response = await apiClient('/auth/register', {
                method: 'POST',
                body: registrationData
            });

            setSuccess(true);
            setFormData({
                username: '',
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>✓</div>
                    <h1>Registration Successful!</h1>
                    <p>Your account has been created and is pending admin approval.</p>
                    <p>You will be able to log in once an administrator activates your account.</p>
                    <Button as={Link} to="/login" className={styles.loginLink}>
                        Return to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.registerCard}>
                <div className={styles.header}>
                    <h1>Create Account</h1>
                    <p>Register for a new account</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <p className={styles.error}>{error}</p>}

                    <Input
                        id="username"
                        name="username"
                        label="Username *"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />

                    <Input
                        id="name"
                        name="name"
                        label="Full Name *"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />

                    <Input
                        id="email"
                        name="email"
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />

                    <Input
                        id="password"
                        name="password"
                        label="Password *"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={6}
                    />

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password *"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={6}
                    />

                    <Button type="submit" disabled={loading} className={styles.submitBtn}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>

                <div className={styles.footer}>
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className={styles.link}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
