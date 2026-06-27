const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { generateImage } = require('../services/ai');

const JWT_SECRET = process.env.JWT_SECRET || 'jihe-ai-secret-key-2024-prod';

// Optional auth middleware - sets req.userId if token present
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
    } catch (err) {
      // Token invalid, continue without auth
    }
  }
  next();
}

// Generate image
router.post('/', optionalAuth, async (req, res) => {
  const { prompt, model = 'dalle3', count = 1, ratio, resolution, apiKey } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: '请输入产品名和描述' });
  }

  // If user has API key set, use it; otherwise check env
  const effectiveKey = apiKey || process.env.OPENAI_API_KEY;
  
  if (!effectiveKey) {
    return res.status(400).json({ 
      error: '请配置 OpenAI API Key', 
      images: Array.from({ length: count }, (_, i) =>
        'https://placehold.co/' + (ratio === 'smart-1-1' ? '800x800' : '800x1200') +
        '/1a1a2e/e0e0ff?text=请先配置API+Key'
      )
    });
  }

  try {
    // Check credits if logged in
    if (req.userId) {
      const userResult = await pool.query('SELECT credits FROM users WHERE id = ?', [req.userId]);
      if (userResult.rows.length > 0 && userResult.rows[0].credits < count) {
        return res.status(402).json({ error: '积分不足，请充值。当前积分：' + userResult.rows[0].credits });
      }
    }

    const images = await generateImage({ prompt, model, count, ratio, resolution, apiKey: effectiveKey });

    // Deduct credits if logged in
    if (req.userId) {
      await pool.query('UPDATE users SET credits = credits - ? WHERE id = ?', [count, req.userId]);
      const userResult = await pool.query('SELECT credits FROM users WHERE id = ?', [req.userId]);
      const remainingCredits = userResult.rows.length > 0 ? userResult.rows[0].credits : 0;

      await pool.query(
        'INSERT INTO generations (user_id, product_name, tool_type, prompt, model, images, count, ratio, resolution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.userId, prompt.substring(0, 50), 'ai-detail-page', prompt, model, JSON.stringify(images), count, ratio, resolution]
      );

      return res.json({ success: true, images, remainingCredits });
    }

    res.json({ success: true, images });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: '生成失败：' + err.message });
  }
});

// Get generation history
router.get('/history', optionalAuth, async (req, res) => {
  if (!req.userId) return res.status(401).json({ error: '请先登录' });
  try {
    const result = await pool.query(
      'SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );
    res.json({ generations: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Public cases
router.get('/cases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cases ORDER BY created_at DESC LIMIT 20');
    res.json({ cases: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
