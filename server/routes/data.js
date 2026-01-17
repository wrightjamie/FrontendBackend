const express = require('express');
const router = express.Router();
const DataType = require('../models/DataType');
const DataEntity = require('../models/DataEntity');

// Middleware to check if user is admin/editor
const isAuthorized = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'editor')) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

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
router.post('/types', isAuthorized, async (req, res) => {
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

// Get all entities for a specific type
router.get('/entities/:typeId', async (req, res) => {
    try {
        const entities = await DataEntity.findByType(req.params.typeId);
        res.json(entities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new entity
router.post('/entities/:typeId', isAuthorized, async (req, res) => {
    try {
        const entity = await DataEntity.create(req.params.typeId, req.body);
        res.status(201).json(entity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update entity
router.put('/entities/:id', isAuthorized, async (req, res) => {
    try {
        const entity = await DataEntity.update(req.params.id, req.body);
        res.json(entity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete entity
router.delete('/entities/:id', isAuthorized, async (req, res) => {
    try {
        await DataEntity.remove(req.params.id);
        res.json({ message: 'Entity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reorder entities
router.post('/entities/reorder', isAuthorized, async (req, res) => {
    try {
        const { updates } = req.body;
        await DataEntity.reorder(updates);
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
