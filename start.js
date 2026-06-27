const { execSync } = require('child_process');
const path = require('path');

console.log('=== Jihe AI Deployment ===');
console.log('Node version:', process.version);
console.log('Directory:', __dirname);

try {
  console.log('=== Building frontend ===');
  execSync('npm install --production=false', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

  console.log('=== Installing backend ===');
  execSync('npm install --production=false', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });

  console.log('=== Starting server ===');
  require('./backend/src/index.js');
} catch (err) {
  console.error('Deployment error:', err.message);
  process.exit(1);
}
