const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Media = require('../models/Media');
const mediaConfig = require('../config/mediaConfig');

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
    limits: { fileSize: mediaConfig.uploads.maxSize }
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
                .resize(
                    mediaConfig.thumbnails.width,
                    mediaConfig.thumbnails.height,
                    { fit: mediaConfig.thumbnails.fit }
                )
                .webp({ quality: mediaConfig.thumbnails.quality }) // Optional: standardized format
                .toFile(thumbPath);

            // Generate responsive variants
            const variantData = {};
            const responsiveDir = path.join(__dirname, '../public/uploads/responsive');
            if (!fs.existsSync(responsiveDir)) fs.mkdirSync(responsiveDir, { recursive: true });

            const baseFilename = path.parse(filename).name;

            for (const [sizeName, width] of Object.entries(mediaConfig.responsive.sizes)) {
                const variantFilename = `${baseFilename}-${sizeName}.${mediaConfig.responsive.format}`;
                const variantPath = path.join(responsiveDir, variantFilename);

                await sharp(originalPath)
                    .resize(width, null, { withoutEnlargement: true })
                    .toFormat(mediaConfig.responsive.format, { quality: mediaConfig.responsive.quality })
                    .toFile(variantPath);

                variantData[sizeName] = `/uploads/responsive/${variantFilename}`;
            }

            // Save to DB
            const media = await Media.create({
                filename: filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: `/uploads/${filename}`,
                thumbnailUrl: `/uploads/thumbs/${thumbFilename}`,
                variants: variantData, // Store variants
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

        // Delete responsive variants
        if (media.variants) {
            Object.values(media.variants).forEach(variantUrl => {
                const variantPath = path.join(__dirname, '../public', variantUrl);
                if (fs.existsSync(variantPath)) fs.unlinkSync(variantPath);
            });
        }

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

/**
 * @route   POST /api/upload/regenerate-thumbs
 * @desc    Regenerate ALL thumbnails based on current config
 */
router.post('/regenerate-thumbs', async (req, res) => {
    if (!req.session.userId) { // TODO: Check for admin specifically if roles are enforced
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const assets = await Media.findAll();
        const results = {
            total: assets.length,
            success: 0,
            failed: 0,
            skipped: 0
        };

        const uploadDir = path.join(__dirname, '../public/uploads');
        const thumbDir = path.join(uploadDir, 'thumbs');
        if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

        for (const asset of assets) {
            const originalPath = path.join(uploadDir, asset.filename);
            const thumbPath = path.join(thumbDir, `thumb-${asset.filename}`);

            if (fs.existsSync(originalPath)) {
                try {
                    // 1. Regenerate Thumbnail
                    await sharp(originalPath)
                        .resize(
                            mediaConfig.thumbnails.width,
                            mediaConfig.thumbnails.height,
                            { fit: mediaConfig.thumbnails.fit }
                        )
                        .webp({ quality: mediaConfig.thumbnails.quality })
                        .toFile(thumbPath);

                    // 2. Regenerate Responsive Variants
                    const variantData = {};
                    const baseFilename = path.parse(asset.filename).name;

                    for (const [sizeName, width] of Object.entries(mediaConfig.responsive.sizes)) {
                        const variantFilename = `${baseFilename}-${sizeName}.${mediaConfig.responsive.format}`;
                        const vPath = path.join(responsiveDir, variantFilename);

                        await sharp(originalPath)
                            .resize(width, null, { withoutEnlargement: true })
                            .toFormat(mediaConfig.responsive.format, { quality: mediaConfig.responsive.quality })
                            .toFile(vPath);

                        variantData[sizeName] = `/uploads/responsive/${variantFilename}`;
                    }

                    // 3. Update DB
                    await Media.update(asset._id, { variants: variantData });

                    results.success++;
                } catch (err) {
                    console.error(`Failed to regenerate assets for ${asset.filename}:`, err);
                    results.failed++;
                }
            } else {
                results.skipped++;
            }
        }

        res.json({
            message: 'Thumbnail regeneration complete',
            results
        });
    } catch (err) {
        console.error('Regeneration error:', err);
        res.status(500).json({ message: 'Failed to regenerate thumbnails' });
    }
});

module.exports = router;
