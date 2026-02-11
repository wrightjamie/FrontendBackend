import React from 'react';
import { useSiteMeta } from '../../hooks/useSiteMeta';

/**
 * ResponsiveImage: A component that uses srcset to provide responsive images.
 * @param {Object} image - The image object from the Media model.
 * @param {string} alt - Alternative text.
 * @param {string} className - Additional CSS classes.
 * @param {string} sizes - The sizes attribute for responsive images.
 */
const ResponsiveImage = ({ image, alt, className, sizes = '100vw', ...props }) => {
    const { meta } = useSiteMeta();

    if (!image) return null;

    const { url, variants } = image;
    const config = meta.media.responsive;

    // Build srcset from variants
    const srcSetEntries = [];

    // Add variants if they exist and are present in the server config
    if (variants && config && config.sizes) {
        Object.entries(variants).forEach(([sizeName, variantUrl]) => {
            const width = config.sizes[sizeName];
            if (width) {
                srcSetEntries.push(`${variantUrl} ${width}w`);
            }
        });
    }

    // Always include the original as a potential fallback in the srcset
    // (though usually, the largest variant would suffice)
    // srcSetEntries.push(`${url} 2560w`); // Example for original

    const srcSet = srcSetEntries.length > 0 ? srcSetEntries.join(', ') : undefined;

    return (
        <img
            src={url}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt || image.title || image.originalName || ''}
            className={className}
            loading="lazy"
            {...props}
        />
    );
};

export default ResponsiveImage;
