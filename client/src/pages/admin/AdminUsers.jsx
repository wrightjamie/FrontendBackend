import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers, useUserMutations } from '../../hooks/useUsers';
import { Button } from '../../components/ui/Buttons';
import { Badge } from '../../components/ui/Badge';
import styles from './AdminUsers.module.css';

/**
 * AdminUsers: User management interface for admins
 * Displays all users in a table with actions for approve, edit role/status, and delete
 */
const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const { data: users, loading, error, refresh } = useUsers();
    const { approveUser, updateUser, deleteUser, resetPassword } = useUserMutations();

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [passwordForm, setPasswordForm] = useState({ userId: null, password: '', confirmPassword: '' });

    const handleEdit = (user) => {
        setEditingId(user._id);
        setEditForm({
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveEdit = async (userId) => {
        const res = await updateUser(userId, editForm);
        if (res.success) {
            setEditingId(null);
            setEditForm({});
            refresh();
        } else {
            alert(`Error updating user: ${res.error?.message || 'Update failed'}`);
        }
    };

    const handleApprove = async (userId) => {
        if (window.confirm('Approve this user?')) {
            const res = await approveUser(userId);
            if (res.success) {
                refresh();
            } else {
                alert(`Error approving user: ${res.error?.message || 'Approval failed'}`);
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const res = await deleteUser(userId);
            if (res.success) {
                refresh();
            } else {
                alert(`Error deleting user: ${res.error?.message || 'Delete failed'}`);
            }
        }
    };

    const handleResetPassword = async (userId) => {
        const newPassword = prompt('Enter new password for this user (min 6 characters):');
        if (newPassword && newPassword.length >= 6) {
            const res = await resetPassword(userId, newPassword);
            if (res.success) {
                alert('Password reset successfully');
            } else {
                alert(`Error resetting password: ${res.error?.message || 'Reset failed'}`);
            }
        } else if (newPassword) {
            alert('Password must be at least 6 characters');
        }
    };

    if (loading && !users) return <div className={styles.loading}>Loading users...</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    const pendingUsers = users?.filter(u => u.status === 'pending') || [];
    const activeUsers = users?.filter(u => u.status !== 'pending') || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>User Management</h2>
                    <p>Manage user accounts, roles, and permissions</p>
                </div>
            </div>

            {/* Pending Users Section */}
            {pendingUsers.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        Pending Approval ({pendingUsers.length})
                    </h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Registered</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map(user => (
                                    <tr key={user._id} className={styles.pendingRow}>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className={styles.actionsCell}>
                                            <div className={styles.actions}>
                                                <Button
                                                    onClick={() => handleApprove(user._id)}
                                                    intent="success"
                                                    size="sm"
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(user._id)}
                                                    intent="danger"
                                                    size="sm"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Active Users Section */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>All Users ({activeUsers.length})</h3>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeUsers.map(user => {
                                const isSelf = currentUser?._id === user._id;
                                return (
                                    <tr key={user._id}>
                                        {editingId === user._id ? (
                                            <>
                                                <td>{user.username}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="email"
                                                        className={styles.input}
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className={styles.select}
                                                        value={editForm.role}
                                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                        disabled={isSelf}
                                                        title={isSelf ? "You cannot change your own role" : ""}
                                                    >
                                                        <option value="viewer">Viewer</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className={styles.select}
                                                        value={editForm.status}
                                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                        disabled={isSelf}
                                                        title={isSelf ? "You cannot change your own status" : ""}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </td>
                                                <td className={styles.actionsCell}>
                                                    <div className={styles.actions}>
                                                        <Button onClick={() => handleSaveEdit(user._id)} intent="success" size="sm">
                                                            Save
                                                        </Button>
                                                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{user.username}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <Badge variant={user.role === 'admin' ? 'info' : user.role === 'editor' ? 'success' : 'default'}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'}>
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className={styles.actionsCell}>
                                                    <div className={styles.actions}>
                                                        <Button onClick={() => handleEdit(user)} size="sm">
                                                            Edit
                                                        </Button>
                                                        <Button onClick={() => handleResetPassword(user._id)} intent="warning" size="sm">
                                                            Reset Password
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(user._id)}
                                                            intent="danger"
                                                            size="sm"
                                                            disabled={isSelf}
                                                            title={isSelf ? "You cannot delete your own account" : ""}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
