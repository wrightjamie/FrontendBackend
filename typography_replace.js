const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');

const weightMap = {
    '400': 'var(--font-normal)',
    '500': 'var(--font-medium)',
    '600': 'var(--font-semibold)',
    '700': 'var(--font-bold)',
    '800': 'var(--font-bold)'
};

const sizeMap = {
    '2.5rem': 'var(--text-4xl)',
    '2.25rem': 'var(--text-3xl)',
    '2rem': 'var(--text-3xl)',
    '1.75rem': 'var(--text-2xl)',
    '1.5rem': 'var(--text-2xl)',
    '1.25rem': 'var(--text-xl)',
    '1.125rem': 'var(--text-lg)',
    '1.1rem': 'var(--text-lg)',
    '1rem': 'var(--text-base)',
    '0.95rem': 'var(--text-sm)',
    '0.9rem': 'var(--text-sm)',
    '0.875rem': 'var(--text-sm)',
    '0.85rem': 'var(--text-sm)',
    '0.8rem': 'var(--text-xs)',
    '0.75rem': 'var(--text-xs)',
    '0.6rem': 'var(--text-xs)',
    '0.8em': 'var(--text-xs)'
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace font-weight
            content = content.replace(/font-weight:\s*(\d+);/g, (match, weight) => {
                if (weightMap[weight]) {
                    modified = true;
                    return `font-weight: ${weightMap[weight]};`;
                }
                return match;
            });

            // Replace font-size
            content = content.replace(/font-size:\s*([0-9.]+r?e?m|px);/g, (match, size) => {
                let s = size;
                if(s === "16px") s = "1rem";
                if(s === "14px") s = "0.875rem";
                if(s === "12px") s = "0.75rem";
                
                if (sizeMap[s]) {
                    modified = true;
                    return `font-size: ${sizeMap[s]};`;
                }
                return match;
            });

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath.replace(__dirname, '')}`);
            }
        }
    }
}

processDir(srcDir);
console.log('Done!');
