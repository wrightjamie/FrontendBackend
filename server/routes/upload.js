const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Media = require('../models/Media');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * @route   POST /api/upload
 * @desc    Upload image, generate thumbnail, save to DB
 */
router.post('/', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const uploadSingle = upload.single('image');

    uploadSingle(req, res, async function (err) {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        try {
            const originalPath = req.file.path;
            const filename = req.file.filename;
            const thumbFilename = `thumb-${filename}`;
            const thumbPath = path.join(__dirname, '../public/uploads/thumbs', thumbFilename);

            // Ensure thumb dir exists
            const thumbDir = path.dirname(thumbPath);
            if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

            // Generate thumbnail
            await sharp(originalPath)
                .resize(300, 300, { fit: 'cover' })
                .toFile(thumbPath);

            // Save to DB
            const media = await Media.create({
                filename: filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/uploads/${filename}`,
                thumbnailUrl: `/uploads/thumbs/${thumbFilename}`,
                title: req.file.originalname // Default title
            });

            res.json({
                message: 'Upload successful',
                ...media
            });

        } catch (error) {
            // Clean up if DB save or resize fails
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            console.error('Upload Error:', error);
            res.status(500).json({ message: 'Failed to process image' });
        }
    });
});

/**
 * @route   GET /api/upload
 * @desc    List all media assets
 */
router.get('/', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const media = await Media.findAll();
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});

/**
 * @route   DELETE /api/upload/:id
 */
router.delete('/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const media = await Media.findOne(req.params.id);
        if (!media) return res.status(404).json({ message: 'Media not found' });

        // Paths
        const uploadDir = path.join(__dirname, '../public/uploads');
        const filePath = path.join(uploadDir, media.filename);
        const thumbPath = path.join(uploadDir, 'thumbs', `thumb-${media.filename}`);

        // Delete files
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

        // Remove from DB
        await Media.remove(req.params.id);

        res.json({ message: 'Media deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete media' });
    }
});

/**
 * @route   PUT /api/upload/:id
 * @desc    Update media metadata (title)
 */
router.put('/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const { title } = req.body;
        const updatedMedia = await Media.update(req.params.id, { title });

        if (!updatedMedia) {
            return res.status(404).json({ message: 'Media not found' });
        }

        res.json(updatedMedia);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update media' });
    }
});

module.exports = router;
