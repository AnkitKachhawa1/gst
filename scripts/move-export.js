const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');
const toolDir = path.join(outDir, 'tool');

console.log('Starting post-build script: Moving files to subfolder matching basePath...');

if (!fs.existsSync(outDir)) {
  console.error('Error: "out" directory does not exist. Did the build fail?');
  process.exit(1);
}

// Create the 'tool' subdirectory
if (!fs.existsSync(toolDir)) {
  fs.mkdirSync(toolDir, { recursive: true });
}

// Read all files/dirs in 'out'
const items = fs.readdirSync(outDir);

items.forEach(item => {
  // Skip the target directory itself
  if (item === 'tool') return;

  const srcPath = path.join(outDir, item);
  const destPath = path.join(toolDir, item);

  console.log(`Moving ${item} to tool/${item}`);
  fs.renameSync(srcPath, destPath);
});

// Optional: Copy 404.html back to root for Vercel global 404 handling
const nested404 = path.join(toolDir, '404.html');
const root404 = path.join(outDir, '404.html');

if (fs.existsSync(nested404)) {
  console.log('Copying 404.html back to root for global error handling');
  fs.copyFileSync(nested404, root404);
}

console.log('Success: Files moved to out/tool/');
