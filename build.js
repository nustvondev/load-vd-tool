const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('Building ToolVideo V2 Application');
console.log('========================================');
console.log('');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('');
}

// Check if electron-builder is installed
try {
  require.resolve('electron-builder');
} catch (e) {
  console.log('Installing electron-builder...');
  execSync('npm install --save-dev electron-builder', { stdio: 'inherit' });
  console.log('');
}

// Detect platform
const platform = process.platform;
let buildCommand = 'npm run build';

switch (platform) {
  case 'win32':
    console.log('Building application for Windows...');
    buildCommand = 'npm run build:win';
    break;
  case 'darwin':
    console.log('Building application for macOS...');
    buildCommand = 'npm run build:mac';
    break;
  case 'linux':
    console.log('Building application for Linux...');
    buildCommand = 'npm run build:linux';
    break;
  default:
    console.log(`Building application for ${platform}...`);
    buildCommand = 'npm run build';
}

console.log('');

try {
  execSync(buildCommand, { stdio: 'inherit' });
  console.log('');
  console.log('========================================');
  console.log('Build completed successfully!');
  console.log('Output directory: dist');
  console.log('========================================');
} catch (error) {
  console.log('');
  console.log('========================================');
  console.log('Build failed!');
  console.log('========================================');
  process.exit(1);
}

