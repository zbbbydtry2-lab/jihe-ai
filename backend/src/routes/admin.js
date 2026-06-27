const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'jihe-ai-secret-key-2024';

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, phone, credits, created_at FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/generations', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM generations ORDER BY created_at DESC LIMIT 100');
    res.json({ generations: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/cases', adminMiddleware, async (req, res) => {
  const { title, description, image_url, category } = req.body;
  try {
    await pool.query(
      'INSERT INTO cases (title, description, image_url, category) VALUES (?, ?, ?, ?)',
      [title, description, image_url, category]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/credits', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { credits } = req.body;
  try {
    await pool.query('UPDATE users SET credits = ? WHERE id = ?', [credits, id]);
    const result = await pool.query('SELECT id, phone, credits FROM users WHERE id = ?', [id]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
