const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Media = require('../models/Media');
const mediaConfig = require('../config/mediaConfig');

// Configure storage
const UPLOAD_ROOT = process.env.NODE_ENV === 'test'
    ? path.join(__dirname, '../tests/uploads')
    : path.join(__dirname, '../public/uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(UPLOAD_ROOT)) {
            fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
        }
        cb(null, UPLOAD_ROOT);
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

    const uploadMultiple = upload.array('image');

    uploadMultiple(req, res, async function (err) {
        if (err) return res.status(400).json({ message: err.message });

        // Multer puts files in req.files for array(), or req.file for single()
        // We can handle both if we normalize
        const files = req.files || (req.file ? [req.file] : []);

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedMedia = [];
        const errors = [];

        for (const file of files) {
            try {
                const originalPath = file.path;
                const filename = file.filename;
                const thumbFilename = `thumb-${filename}`;
                const thumbPath = path.join(UPLOAD_ROOT, 'thumbs', thumbFilename);

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
                    .webp({ quality: mediaConfig.thumbnails.quality })
                    .toFile(thumbPath);

                // Generate responsive variants
                const variantData = {};
                const responsiveDir = path.join(UPLOAD_ROOT, 'responsive');
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
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    url: `/uploads/${filename}`,
                    thumbnailUrl: `/uploads/thumbs/${thumbFilename}`,
                    variants: variantData,
                    title: file.originalname
                });

                uploadedMedia.push(media);

            } catch (error) {
                console.error(`Error processing file ${file.originalname}:`, error);
                errors.push({ file: file.originalname, error: error.message });

                // Cleanup this specific file if it failed
                if (file && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        if (uploadedMedia.length === 0 && errors.length > 0) {
            return res.status(500).json({ message: 'Failed to process uploads', errors });
        }

        // Return the array of created media objects
        // If it was a single file upload request (conceptually), the client might expect an object,
        // but our new contract says we return an array or a standardized structure.
        // To maintain backward compatibility with `ImageUpload.jsx` (which expects a single object if updated poorly),
        // we should be careful. However, we are updating the client too.
        // Let's return { message: '...', media: [...] } but also spread the first one if length is 1?
        // No, let's result a standard structure: { message: '...', results: [...] }

        // Wait, the client looks for `data.url`.
        // If we change the response structure, we MUST update the client simultaneously.
        // The implementation plan says "Update `ImageUpload.jsx`... handle array response".

        res.json({
            message: 'Upload successful',
            results: uploadedMedia,
            errors: errors.length > 0 ? errors : undefined,
            // For backward compat (if any single-upload consumers exist unchanged), 
            // we could expose the first file's props, but better to break cleanly if we are updating everything.
            // But `ImageUpload` in current form does: `setPreview(data.url)`. 
            // We'll update the client to look for `results[0].url` or similar.
        });
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
        const uploadDir = UPLOAD_ROOT;
        const filePath = path.join(uploadDir, media.filename);
        const thumbPath = path.join(uploadDir, 'thumbs', `thumb-${media.filename}`);

        // Delete files
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

        // Delete responsive variants
        if (media.variants) {
            Object.values(media.variants).forEach(variantUrl => {
                // For deletion, we need to map the URL back to the file system
                // URL: /uploads/responsive/... -> FS: UPLOAD_ROOT/responsive/...
                const relativePath = variantUrl.replace(/^\/uploads\//, '');
                const variantPath = path.join(UPLOAD_ROOT, relativePath);
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

        const uploadDir = UPLOAD_ROOT;
        const thumbDir = path.join(uploadDir, 'thumbs');
        const responsiveDir = path.join(uploadDir, 'responsive');

        if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });
        if (!fs.existsSync(responsiveDir)) fs.mkdirSync(responsiveDir, { recursive: true });

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
