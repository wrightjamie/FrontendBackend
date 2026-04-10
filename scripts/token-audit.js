const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../client/src');
let exitCode = 0;
let outputData = "";

function log(msg) {
    console.log(msg);
    outputData += msg + "\n";
}

function findCssFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (filePath.endsWith('.css')) {
      if (file !== 'tokens.css' && file !== 'variables.css' && file !== 'reset.css') {
          fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const cssFiles = findCssFiles(SRC_DIR);

const patterns = [
  {
    regex: /#([0-9a-fA-F]{3,8})|rgba?\([^)]+\)|hsla?\([^)]+\)/gi,
    type: 'error',
    category: 'Hardcoded Color',
    suggestion: 'Use --color-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])(?:padding|margin|gap|top|bottom|left|right)(?:-[a-zA-Z]+)*\s*:\s*([^;]+);/gi,
    type: 'error',
    category: 'Hardcoded Spacing',
    suggestion: 'Use --space-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])font-size\s*:\s*([^;]+);/gi,
    type: 'error',
    category: 'Hardcoded Font Size',
    suggestion: 'Use --text-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])font-weight\s*:\s*([^;]+);/gi,
    type: 'error',
    category: 'Hardcoded Font Weight',
    suggestion: 'Use --font-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])border-radius\s*:\s*([^;]+);/gi,
    type: 'error',
    category: 'Hardcoded Border Radius',
    suggestion: 'Use --radius-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])box-shadow\s*:\s*([^;]+);/gi,
    type: 'error',
    category: 'Hardcoded Box Shadow',
    suggestion: 'Use --shadow-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])z-index\s*:\s*([^;]+);/gi,
    type: 'error',
    category: 'Hardcoded Z-Index',
    suggestion: 'Use --z-* tokens'
  },
  {
    regex: /(?<![-a-zA-Z])transition(?:-duration)?\s*:\s*([^;]+);/gi,
    type: 'warning',
    category: 'Hardcoded Transition',
    suggestion: 'Use --transition-* tokens'
  }
];

let totalErrors = 0;
let totalWarnings = 0;

cssFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const relPath = path.relative(SRC_DIR, file).replace(/\\/g, '/');

  lines.forEach((line, lineIdx) => {
    let cleanLine = line
      .replace(/var\([^)]+\)/g, ' 0 ')
      .replace(/calc\b[^;]+/g, ' 0 ')
      .replace(/color-mix\b[^;]+/g, ' 0 ')
      .replace(/oklch\b[^;]+/g, ' 0 ')
      .replace(/anchor\b[^;]+/g, ' 0 ')
      .replace(/!important/g, '');

    patterns.forEach(p => {
      const matches = [...cleanLine.matchAll(p.regex)];
      matches.forEach(m => {
        let val = m[1] ? m[1].trim() : m[0].trim();
        
        if (!val || val === '' || val === 'calc()') return;
        
        // Strip commas and clean up
        const allowed = ['0', 'none', 'inherit', 'initial', 'transparent', 'currentColor', 'normal', 'auto', '100%', '50%', '-50%',
          'transform', 'opacity', 'filter', 'all', 'background', 'color', 'border-color', 'box-shadow', 'background-color',
          'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'solid', '1px', '-1px'
        ];
        const tokens = val.replace(/,/g, ' ').split(/\s+/).filter(v => v);
        const allAllowed = tokens.every(v => allowed.includes(v));
        if (allAllowed) return;

        if (p.category === 'Hardcoded Color') val = m[0];

        log(`[${p.type.toUpperCase()}] ${relPath}:${lineIdx + 1}
  Violation: ${p.category} -> "${val}"`);
        
        if (p.type === 'error') {
            totalErrors++;
            exitCode = 1;
        } else {
            totalWarnings++;
        }
      });
    });
  });
});

log(`\nAudit complete: ${totalErrors} Errors, ${totalWarnings} Warnings.`);
fs.writeFileSync(path.join(__dirname, '../audit_rem.txt'), outputData);
if (exitCode === 1) process.exit(1);
