const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');
const subPath = 'tools/gstr2b-reco'; // Update this to match next.config.js basePath
const targetDir = path.join(outDir, subPath);

console.log(`Starting post-build script: Moving files to ${subPath}...`);

if (!fs.existsSync(outDir)) {
  console.error('Error: "out" directory does not exist. Did the build fail?');
  process.exit(1);
}

// Create the target directory recursively
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read all files/dirs in 'out'
const items = fs.readdirSync(outDir);

// Get the first segment of the subPath to exclude it from moving
// e.g. if subPath is 'tools/gstr2b-reco', we don't want to move 'tools'
const rootFolderToExclude = subPath.split('/')[0].split('\\')[0]; 

items.forEach(item => {
  // Skip the root folder of our target path (e.g., 'tools')
  if (item === rootFolderToExclude) return;

  const srcPath = path.join(outDir, item);
  const destPath = path.join(targetDir, item);

  console.log(`Moving ${item} to ${subPath}/${item}`);
  
  // If moving a directory to a destination that might interact with itself, verify (though exclusion above handles the root case)
  fs.renameSync(srcPath, destPath);
});

// Optional: Copy 404.html back to root for Vercel global 404 handling
const nested404 = path.join(targetDir, '404.html');
const root404 = path.join(outDir, '404.html');

if (fs.existsSync(nested404)) {
  console.log('Copying 404.html back to root for global error handling');
  fs.copyFileSync(nested404, root404);
}

console.log(`Success: Files moved to out/${subPath}/`);
