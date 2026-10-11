import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.yalc', 'dist', 'var', '__tests__', '__mocks__'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else if (dirPath.endsWith('.ts') && !dirPath.endsWith('.spec.ts') && !dirPath.includes('mock')) {
      callback(dirPath);
    }
  });
}

const replacements = [
  { regex: /:\s*Record<string,\s*any>/g, replacement: ': Record<string, unknown>' },
  { regex: /\.\.\.([a-zA-Z0-9_]+):\s*any\[\]/g, replacement: '...$1: unknown[]' },
  { regex: /\[key:\s*string\]:\s*any/g, replacement: '[key: string]: unknown' }
];

walkDir('.', filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});
