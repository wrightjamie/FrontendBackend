const express = require('express');
const router = express.Router();
const SiteMeta = require('../models/SiteMeta');

// GET /api/site/meta
router.get('/meta', async (req, res) => {
    try {
        const meta = await SiteMeta.get();
        res.json(meta);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching site metadata' });
    }
});

// PUT /api/site/meta (Protected later, open for now to test)
router.put('/meta', async (req, res) => {
    try {
        const updated = await SiteMeta.update(req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating site metadata' });
    }
});

module.exports = router;
