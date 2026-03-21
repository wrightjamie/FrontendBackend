import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import { useUsers, useUserMutations } from '../../hooks/useUsers';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/form/Input';
import { Select } from '../../components/ui/form/Select';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import {
    Users,
    UserCheck,
    UserMinus,
    Clock,
    Pencil,
    Trash2,
    Key,
    Check,
    X,
    ShieldCheck
} from 'lucide-react';
import TabNavigation from '../../components/ui/TabNavigation';
import styles from './AdminUsers.module.css';

/**
 * AdminUsers: User management interface for admins
 * Displays all users in a table with actions for approve, edit role/status, and delete
 */
const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const { data: users, loading, error, refresh } = useUsers();
    const { approveUser, updateUser, deleteUser, resetPassword } = useUserMutations();
    const { confirm, prompt } = useModal();
    const { addToast } = useToast();

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [filterStatus, setFilterStatus] = useState('all');

    const filterTabs = [
        { value: 'all', label: 'All Users', icon: <Users size={16} /> },
        { value: 'active', label: 'Active', icon: <ShieldCheck size={16} /> },
        { value: 'pending', label: 'Pending Approval', icon: <Clock size={16} /> },
        { value: 'suspended', label: 'Suspended', icon: <UserMinus size={16} /> },
    ];

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
            addToast(res.error?.message || 'Update failed', 'error');
        }
    };

    const handleApprove = async (userId) => {
        const confirmed = await confirm({
            title: 'Approve User',
            message: 'Approve this user?',
            confirmText: 'Approve',
            intent: 'success'
        });
        if (confirmed) {
            const res = await approveUser(userId);
            if (res.success) {
                addToast('User approved successfully', 'success');
                refresh();
            } else {
                addToast(res.error?.message || 'Approval failed', 'error');
            }
        }
    };

    const handleDelete = async (userId) => {
        const confirmed = await confirm({
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            intent: 'danger'
        });
        if (confirmed) {
            const res = await deleteUser(userId);
            if (res.success) {
                addToast('User deleted successfully', 'success');
                refresh();
            } else {
                addToast(res.error?.message || 'Delete failed', 'error');
            }
        }
    };

    const handleResetPassword = async (userId) => {
        const newPassword = await prompt({
            title: 'Reset Password',
            message: 'Enter new password for this user (min 6 characters):',
            submitText: 'Reset Password',
            intent: 'warning'
        });
        if (newPassword && newPassword.length >= 6) {
            const res = await resetPassword(userId, newPassword);
            if (res.success) {
                addToast('Password reset successfully', 'success');
            } else {
                addToast(res.error?.message || 'Reset failed', 'error');
            }
        } else if (newPassword) {
            addToast('Password must be at least 6 characters', 'error');
        }
    };

    if (loading && !users) return <div className={styles.loading}>Loading users...</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    const filteredUsers = users?.filter(u => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'active') return u.status === 'active' || u.status === 'admin'; // 'active' might need to cover both
        return u.status === filterStatus;
    }) || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>User Management</h2>
                    <p>Manage user accounts, roles, and permissions</p>
                </div>
            </div>

            <TabNavigation
                tabs={filterTabs}
                variant="pill"
                activeTab={filterStatus}
                onTabClick={setFilterStatus}
            />

            <div className={styles.tableWrapper}>
                <Table dense={true}>
                    <Thead>
                        <Tr>
                            <Th>Username</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredUsers.length === 0 ? (
                            <Tr>
                                <Td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    No users found matching this filter.
                                </Td>
                            </Tr>
                        ) : (
                            filteredUsers.map(user => {
                                const isSelf = currentUser?._id === user._id;
                                const isEditing = editingId === user._id;

                                return (
                                    <Tr key={user._id} className={user.status === 'pending' ? styles.pendingRow : ''}>
                                        {isEditing ? (
                                            <>
                                                <Td>{user.username}</Td>
                                                <Td>
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        dense
                                                    />
                                                </Td>
                                                <Td>
                                                    <Input
                                                        type="email"
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                        dense
                                                    />
                                                </Td>
                                                <Td>
                                                    <Select
                                                        value={editForm.role}
                                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                        options={[
                                                            { value: 'viewer', label: 'Viewer' },
                                                            { value: 'editor', label: 'Editor' },
                                                            { value: 'admin', label: 'Admin' }
                                                        ]}
                                                        disabled={isSelf}
                                                    />
                                                </Td>
                                                <Td>
                                                    <Select
                                                        value={editForm.status}
                                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                        options={[
                                                            { value: 'active', label: 'Active' },
                                                            { value: 'suspended', label: 'Suspended' },
                                                            { value: 'pending', label: 'Pending' }
                                                        ]}
                                                        disabled={isSelf}
                                                    />
                                                </Td>
                                                <Td className={styles.actionsCell}>
                                                    <div className={styles.actions}>
                                                        <Button onClick={() => handleSaveEdit(user._id)} intent="success" size="sm" title="Save" grouped>
                                                            <Check size={16} />
                                                        </Button>
                                                        <Button onClick={handleCancelEdit} variant="outline" size="sm" title="Cancel" grouped>
                                                            <X size={16} />
                                                        </Button>
                                                    </div>
                                                </Td>
                                            </>
                                        ) : (
                                            <>
                                                <Td>{user.username}</Td>
                                                <Td>{user.name}</Td>
                                                <Td>{user.email}</Td>
                                                <Td>
                                                    <Badge
                                                        variant={user.role === 'admin' ? 'info' : user.role === 'editor' ? 'success' : 'default'}
                                                        icon={user.role === 'admin' ? ShieldCheck : user.role === 'editor' ? Pencil : Users}
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Badge
                                                        variant={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'}
                                                        icon={user.status === 'active' ? UserCheck : user.status === 'pending' ? Clock : UserMinus}
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </Td>
                                                <Td className={styles.actionsCell}>
                                                    <div className={styles.actions}>
                                                        {user.status === 'pending' && (
                                                            <Button onClick={() => handleApprove(user._id)} intent="success" variant="outline" size="sm" title="Approve" grouped>
                                                                <UserCheck size={16} />
                                                            </Button>
                                                        )}
                                                        <Button onClick={() => handleEdit(user)} size="sm" variant="outline" title="Edit" grouped>
                                                            <Pencil size={16} />
                                                        </Button>
                                                        <Button onClick={() => handleResetPassword(user._id)} intent="warning" size="sm" variant="outline" title="Reset Password" grouped>
                                                            <Key size={16} />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(user._id)}
                                                            intent="danger"
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isSelf}
                                                            title={isSelf ? "You cannot delete your own account" : "Delete User"}
                                                            grouped
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </Td>
                                            </>
                                        )}
                                    </Tr>
                                );
                            })
                        )}
                    </Tbody>
                </Table>
            </div>
        </div>
    );
};

export default AdminUsers;
