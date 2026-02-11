/**
 * Media Configuration
 * Centralized settings for image processing and thumbnails.
 */
module.exports = {
    thumbnails: {
        width: 300,
        height: 300,
        fit: 'cover', // Options: cover, contain, fill, inside, outside
        quality: 80,
    },
    uploads: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedMimetypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
    responsive: {
        sizes: {
            sm: 640,
            md: 1024,
            lg: 1920
        },
        quality: 80,
        format: 'webp'
    }
};
