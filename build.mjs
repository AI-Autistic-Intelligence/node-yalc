import fs from 'fs/promises';
import path from 'path';

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function run() {
  const rootDist = path.join(process.cwd(), 'dist');
  const items = await fs.readdir(rootDist, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const srcDir = path.join(rootDist, item.name, 'src');
      const destDir = path.join(process.cwd(), item.name, 'dist', 'src');
      
      try {
        await fs.access(srcDir);
        await copyDir(srcDir, destDir);
        console.log(`Copied ${item.name} dist.`);
      } catch (e) {
        // Ignored
      }
    }
  }
}

run();
