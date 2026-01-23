const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        // Create unique filename: timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (Images only)
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
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * @route   POST /api/upload
 * @desc    Upload a single image
 * @access  Protected (Authenticated users only)
 */
router.post('/', (req, res) => {
    // Check authentication (basic check for user session)
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const uploadSingle = upload.single('image');

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return path relative to server root for static serving
        // Assuming static serve at /uploads
        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: 'Image uploaded successfully',
            url: fileUrl,
            filename: req.file.filename
        });
    });
});

/**
 * @route   GET /api/upload
 * @desc    List all uploaded images
 * @access  Protected (Admin only)
 */
router.get('/', (req, res) => {
    if (!req.session.userId) { // TODO: Check for admin role specifically if needed
        return res.status(401).json({ message: 'Authentication required' });
    }

    const uploadDir = path.join(__dirname, '../public/uploads');

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            // If dir doesn't exist just return empty list
            if (err.code === 'ENOENT') return res.json([]);
            return res.status(500).json({ message: 'Unable to scan files' });
        }

        const fileInfos = files.map(file => {
            return {
                filename: file,
                url: `/uploads/${file}`,
                // Simple stat could be added here if needed (size, date)
            };
        });

        res.json(fileInfos);
    });
});

/**
 * @route   DELETE /api/upload/:filename
 * @desc    Delete an uploaded image
 * @access  Protected (Admin only)
 */
router.delete('/:filename', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../public/uploads', filename);

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ message: 'Invalid filename' });
    }

    fs.unlink(filepath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'File not found' });
            }
            return res.status(500).json({ message: 'Could not delete file' });
        }

        res.json({ message: 'File deleted successfully' });
    });
});

module.exports = router;
