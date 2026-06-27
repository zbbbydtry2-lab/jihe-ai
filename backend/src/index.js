require('dotenv').config();
const { execSync } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Auto-build frontend if needed (for Railway/cloud deployment)
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (!fs.existsSync(path.join(frontendDist, 'index.html'))) {
  console.log('Frontend not built, building now...');
  try {
    const frontendDir = path.join(__dirname, '..', '..', 'frontend');
    execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
    execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
    console.log('Frontend built successfully');
  } catch(e) {
    console.error('Build failed:', e.message);
    // Continue anyway - API will still work
  }
}

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Force UTF-8 charset
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(body) {
    if (typeof body === 'string' && body.includes('<!doctype') && !res.get('Content-Type')?.includes('charset')) {
      res.set('Content-Type', 'text/html; charset=utf-8');
    }
    return originalSend.call(this, body);
  };
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  app.use(express.static(frontendDist));
  app.get('/{*path}', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
