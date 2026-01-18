import React, { useState } from 'react';
import styles from './DynamicDataTable.module.css';
import { useDynamicDataMutations, useDataEntities } from '../../hooks/useDynamicData';

const DynamicDataTable = ({ type }) => {
    const { data: entities, loading, refresh } = useDataEntities(type._id);
    const { create, update, delete: del, reorder } = useDynamicDataMutations(type._id);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    // Field names for table headers
    const headers = type.fields.map(f => f.name);

    const handleEdit = (entity) => {
        setEditingId(entity._id);
        setFormData(entity);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({});
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let res;
        if (isAdding) {
            res = await create(formData);
        } else {
            res = await update(editingId, formData);
        }

        if (res.success) {
            handleCancel();
            refresh();
        } else {
            alert(`Error saving: ${res.error?.message || 'Operation failed'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            const res = await del(id);
            if (res.success) {
                refresh();
            } else {
                alert(`Error deleting: ${res.error?.message || 'Delete failed'}`);
            }
        }
    };

    const handleMove = async (index, direction) => {
        if (!entities) return;
        const newEntities = [...entities];
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= newEntities.length) return;

        // Swap
        const [movedItem] = newEntities.splice(index, 1);
        newEntities.splice(targetIndex, 0, movedItem);

        // Map to updates for backend
        const updates = newEntities.map((item, idx) => ({
            id: item._id,
            order: idx
        }));

        const res = await reorder(updates);
        if (res.success) {
            refresh();
        } else {
            alert(`Error reordering: ${res.error?.message || 'Operation failed'}`);
        }
    };

    const renderInput = (field, value, onChange) => {
        const id = `field-${field.name}`;
        switch (field.type) {
            case 'boolean':
                return (
                    <input
                        id={id}
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                );
            case 'number':
                return (
                    <input
                        id={id}
                        type="number"
                        className={styles.input}
                        value={value ?? ''}
                        onChange={(e) => onChange(Number(e.target.value))}
                        required={field.required}
                    />
                );
            case 'date':
                return (
                    <input
                        id={id}
                        type="date"
                        className={styles.input}
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={field.required}
                    />
                );
            default: // text
                return (
                    <input
                        id={id}
                        type="text"
                        className={styles.input}
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={field.required}
                        placeholder={field.description}
                    />
                );
        }
    };

    if (loading && !entities) return <div className={styles.loading}>Loading data...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{type.name}</h2>
                <p>{type.description}</p>
                {type.permissions.canAdd && (
                    <button
                        className={styles.addBtn}
                        onClick={() => { setIsAdding(true); setFormData({}); }}
                        disabled={isAdding || !!editingId}
                    >
                        + Add Record
                    </button>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {type.isOrdered && <th>Order</th>}
                            {headers.map(h => <th key={h}>{h}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Adding Row */}
                        {isAdding && (
                            <tr className={styles.editRow}>
                                {type.isOrdered && <td>-</td>}
                                {type.fields.map(field => (
                                    <td key={field.name}>
                                        {renderInput(field, formData[field.name], (val) => setFormData({ ...formData, [field.name]: val }))}
                                    </td>
                                ))}
                                <td>
                                    <button onClick={handleSave} className={styles.saveBtn}>Save</button>
                                    <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
                                </td>
                            </tr>
                        )}

                        {/* Data Rows */}
                        {entities?.map((entity, idx) => (
                            <tr key={entity._id}>
                                {type.isOrdered && (
                                    <td className={styles.orderCell}>
                                        {type.permissions.canReorder && (
                                            <div className={styles.orderBtns}>
                                                <button onClick={() => handleMove(idx, -1)} disabled={idx === 0}>↑</button>
                                                <button onClick={() => handleMove(idx, 1)} disabled={idx === entities.length - 1}>↓</button>
                                            </div>
                                        )}
                                        <span>{idx + 1}</span>
                                    </td>
                                )}
                                {type.fields.map(field => (
                                    <td key={field.name}>
                                        {editingId === entity._id ? (
                                            renderInput(field, formData[field.name], (val) => setFormData({ ...formData, [field.name]: val }))
                                        ) : (
                                            field.type === 'boolean' ? (entity[field.name] ? 'Yes' : 'No') : String(entity[field.name] ?? '')
                                        )}
                                    </td>
                                ))}
                                <td className={styles.actions}>
                                    {editingId === entity._id ? (
                                        <>
                                            <button onClick={handleSave} className={styles.saveBtn}>Save</button>
                                            <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            {type.permissions.canEdit && (
                                                <button onClick={() => handleEdit(entity)} className={styles.editBtn}>Edit</button>
                                            )}
                                            {type.permissions.canDelete && (
                                                <button onClick={() => handleDelete(entity._id)} className={styles.deleteBtn}>Delete</button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DynamicDataTable;
