import { useAuth } from '../context/AuthContext';
import styles from './UserButton.module.css';

const UserButton = () => {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const username = user?.username;

    return (
        <div className={styles.container}>
            <button
                className={styles.userButton}
                popovertarget="login-popover"
            >
                {isLoggedIn ? username || 'User' : 'Login'}
            </button>
        </div>
    );
};

export default UserButton;
