import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import styles from './DynamicDataTable.module.css';
import { useDynamicDataMutations, useDataEntities } from '../../hooks/useDynamicData';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/Table';
import { Input } from '../ui/form/Input';
import { Checkbox } from '../ui/form/Checkbox';
import { RadioGroup } from '../ui/form/RadioGroup';

/**
 * DynamicDataTable: A reusable component to render and manage data for a specific DataType.
 * Handles CRUD operations and reordering.
 * @param {object} props.type - The DataType configuration object.
 */
const DynamicDataTable = ({ type }) => {
    const { data: entities, loading, refresh } = useDataEntities(type._id);
    const { create, update, delete: del, reorder } = useDynamicDataMutations(type._id);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    // Field names for table headers
    const headers = type.fields.map(f => f.name);

    /**
     * handleEdit: Enter editing mode for a specific record.
     */
    const handleEdit = (entity) => {
        setEditingId(entity._id);
        setFormData(entity);
    };

    /**
     * handleCancel: Exit editing/adding mode and reset state.
     */
    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({});
    };

    /**
     * handleSave: Create or Update a record based on current mode.
     */
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

    /**
     * handleDelete: Confirm and delete a record.
     */
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

    /**
     * handleMove: Reorder records within the list.
     * @param {number} index - Current index of the item.
     * @param {number} direction - -1 for Up, 1 for Down.
     */
    const handleMove = async (index, direction) => {
        if (!entities) return;
        const newEntities = [...entities];
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= newEntities.length) return;

        // Swap items in local array
        const [movedItem] = newEntities.splice(index, 1);
        newEntities.splice(targetIndex, 0, movedItem);

        // Map to bulk update objects for backend: [{ id: string, order: number }, ...]
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

    /**
     * renderInput: Helper to render appropriate input field based on schema type.
     */
    /**
     * renderInput: Helper to render appropriate input field based on schema type.
     * Includes demo logic for Checkbox and Radio buttons.
     */
    const renderInput = (field, value, onChange, index = 0) => {
        const id = `field-${field.name}-${index}`;
        switch (field.type) {
            case 'boolean':
                return (
                    <Checkbox
                        id={id}
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                );
            case 'radio':
                // Fields with options like ['red', 'blue', 'green']
                const options = field.options || [];
                // Normalize options to {label, value} format if they are strings
                const radioOptions = options.map(opt =>
                    typeof opt === 'object' ? opt : { label: opt.charAt(0).toUpperCase() + opt.slice(1), value: opt }
                );

                return (
                    <RadioGroup
                        name={`${id}-group`}
                        direction="row"
                        value={value}
                        onChange={onChange}
                        options={radioOptions}
                    />
                );
            case 'number':
                return (
                    <Input
                        id={id}
                        type="number"
                        value={value ?? ''}
                        onChange={(e) => onChange(Number(e.target.value))}
                        required={field.required}
                    />
                );
            case 'date':
                return (
                    <Input
                        id={id}
                        type="date"
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={field.required}
                    />
                );
            default: // text
                return (
                    <Input
                        id={id}
                        type="text"
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
                    <Button
                        onClick={() => { setIsAdding(true); setFormData({}); }}
                        disabled={isAdding || !!editingId}
                    >
                        <Plus size={16} />
                        <span>Add Record</span>
                    </Button>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <Table>
                    <Thead>
                        <Tr>
                            {type.isOrdered && <Th>Order</Th>}
                            {headers.map(h => <Th key={h}>{h}</Th>)}
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {/* Adding Row */}
                        {isAdding && (
                            <Tr className={styles.editRow}>
                                {type.isOrdered && <Td>-</Td>}
                                {type.fields.map(field => (
                                    <Td key={field.name}>
                                        {renderInput(field, formData[field.name], (val) => setFormData({ ...formData, [field.name]: val }), 999)}
                                    </Td>
                                ))}
                                <Td>
                                    <div className={styles.actions}>
                                        <Button onClick={handleSave} intent="success" size="sm" title="Save">
                                            <Check size={16} />
                                        </Button>
                                        <Button onClick={handleCancel} variant="outline" size="sm" title="Cancel">
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </Td>
                            </Tr>
                        )}

                        {/* Data Rows */}
                        {entities?.map((entity, idx) => (
                            <Tr key={entity._id}>
                                {type.isOrdered && (
                                    <Td className={styles.orderCell}>
                                        {type.permissions.canReorder && (
                                            <div className={styles.orderBtns}>
                                                <Button onClick={() => handleMove(idx, -1)} disabled={idx === 0} variant="ghost" size="xs">
                                                    <ArrowUp size={14} />
                                                </Button>
                                                <Button onClick={() => handleMove(idx, 1)} disabled={idx === entities.length - 1} variant="ghost" size="xs">
                                                    <ArrowDown size={14} />
                                                </Button>
                                            </div>
                                        )}
                                        <span>{idx + 1}</span>
                                    </Td>
                                )}
                                {type.fields.map(field => (
                                    <Td key={field.name}>
                                        {editingId === entity._id ? (
                                            renderInput(field, formData[field.name], (val) => setFormData({ ...formData, [field.name]: val }), idx)
                                        ) : (
                                            field.type === 'boolean' ? (entity[field.name] ? 'Yes' : 'No') : String(entity[field.name] ?? '')
                                        )}
                                    </Td>
                                ))}
                                <Td className={styles.actionsCell}>
                                    <div className={styles.actions}>
                                        {editingId === entity._id ? (
                                            <>
                                                <Button onClick={handleSave} intent="success" size="sm" title="Save">
                                                    <Check size={16} />
                                                </Button>
                                                <Button onClick={handleCancel} variant="outline" size="sm" title="Cancel">
                                                    <X size={16} />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {type.permissions.canEdit && (
                                                    <Button onClick={() => handleEdit(entity)} size="sm" title="Edit">
                                                        <Pencil size={16} />
                                                    </Button>
                                                )}
                                                {type.permissions.canDelete && (
                                                    <Button onClick={() => handleDelete(entity._id)} intent="danger" size="sm" title="Delete">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </div>
        </div>
    );
};

export default DynamicDataTable;
