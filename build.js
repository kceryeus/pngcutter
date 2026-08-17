const fs = require('fs');
const path = require('path');

// Target directory
const distDir = path.join(__dirname, 'dist');

console.log('Starting build process...');

// Clean/Create dist directory
if (fs.existsSync(distDir)) {
  console.log('Cleaning existing dist directory...');
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Files and directories to copy
const filesToCopy = [
  'index.html',
  'app.html',
  'logo.png',
  'src'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    console.log(`✓ Copied ${file} to dist/`);
  } else {
    console.warn(`⚠ Warning: ${file} does not exist and was not copied.`);
  }
});

console.log('Build completed successfully!');
