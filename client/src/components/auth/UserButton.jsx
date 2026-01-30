import { useAuth } from '../../context/AuthContext';
import styles from './UserButton.module.css';

const UserButton = () => {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const username = user?.username;

    return (
        <div className={styles.container}>
            <button
                className={styles.userButton}
                popoverTarget="login-popover"
            >
                {isLoggedIn ? username || 'User' : 'Login'}
            </button>
        </div>
    );
};

export default UserButton;
