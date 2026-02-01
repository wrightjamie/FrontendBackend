const express = require('express');
const router = express.Router();
const DataType = require('../models/DataType');
const DataEntity = require('../models/DataEntity');

const { isEditorOrAdmin } = require('../middleware/auth');

/**
 * Data Types (Schemas)
 */

// Get all data types
router.get('/types', async (req, res) => {
    try {
        const types = await DataType.findAll();
        res.json(types);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new data type (Admin only)
router.post('/types', isEditorOrAdmin, async (req, res) => {
    try {
        const type = await DataType.create(req.body);
        res.status(201).json(type);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * Data Entities (Records)
 */

/**
 * GET /api/data/entities/:typeId
 * Retrieve all records for a specific data type.
 */
router.get('/entities/:typeId', async (req, res) => {
    try {
        const { page, limit } = req.query;
        if (page || limit) {
            const result = await DataEntity.findPaginated(
                req.params.typeId,
                parseInt(page) || 1,
                parseInt(limit) || 10
            );
            return res.json(result);
        }
        const entities = await DataEntity.findByType(req.params.typeId);
        res.json(entities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * POST /api/data/entities/reorder
 * Bulk update the order indices of multiple records.
 */
router.post('/entities/reorder', isEditorOrAdmin, async (req, res) => {
    try {
        const { updates } = req.body;
        if (!updates || updates.length === 0) return res.status(400).json({ message: 'No updates provided' });

        // Check if reordering is allowed for this type (assuming all updates belong to the same type)
        const firstId = updates[0].id;
        const firstEntity = await DataEntity.findOne(firstId);
        if (firstEntity) {
            const type = await DataType.findOne(firstEntity.typeId);
            if (!type?.permissions?.canReorder) {
                return res.status(403).json({ message: 'Reordering not permitted for this data type' });
            }
        }

        await DataEntity.reorder(updates);
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * POST /api/data/entities/:typeId
 * Create a new record for a specific data type.
 */
router.post('/entities/:typeId', isEditorOrAdmin, async (req, res) => {
    try {
        const type = await DataType.findOne(req.params.typeId);
        if (!type?.permissions?.canAdd) {
            return res.status(403).json({ message: 'Adding records not permitted for this data type' });
        }
        const entity = await DataEntity.create(req.params.typeId, req.body);
        res.status(201).json(entity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * PUT /api/data/entities/:id
 * Update an existing record by ID.
 */
router.put('/entities/:id', isEditorOrAdmin, async (req, res) => {
    try {
        const entityToUpdate = await DataEntity.findOne(req.params.id);
        if (!entityToUpdate) return res.status(404).json({ message: 'Entity not found' });

        const type = await DataType.findOne(entityToUpdate.typeId);
        if (!type?.permissions?.canEdit) {
            return res.status(403).json({ message: 'Editing records not permitted for this data type' });
        }

        const entity = await DataEntity.update(req.params.id, req.body);
        res.json(entity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * DELETE /api/data/entities/:id
 * Delete an existing record by ID.
 */
router.delete('/entities/:id', isEditorOrAdmin, async (req, res) => {
    try {
        const entityToDelete = await DataEntity.findOne(req.params.id);
        if (!entityToDelete) return res.status(404).json({ message: 'Entity not found' });

        const type = await DataType.findOne(entityToDelete.typeId);
        if (!type?.permissions?.canDelete) {
            return res.status(403).json({ message: 'Deleting records not permitted for this data type' });
        }

        await DataEntity.remove(req.params.id);
        res.json({ message: 'Entity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
