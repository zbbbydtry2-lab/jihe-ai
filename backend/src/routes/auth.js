const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db');
const { sendVerificationEmail } = require('../services/email');

const JWT_SECRET = process.env.JWT_SECRET || 'jihe-ai-secret-key-2024-prod';

// Store verification codes in memory (production should use Redis)
const codeStore = new Map();

// Send verification code via email
router.post('/send-code', async (req, res) => {
  const { phone } = req.body; // phone field can also be email
  
  if (!phone) {
    return res.status(400).json({ error: '请输入手机号或邮箱' });
  }

  const isEmail = phone.includes('@');
  
  if (isEmail) {
    // Email verification
    const code = String(Math.floor(100000 + Math.random() * 900000));
    codeStore.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 });
    
    try {
      await sendVerificationEmail(phone, code);
      console.log('Email code sent to ' + phone + ': ' + code);
      res.json({ success: true, message: '验证码已发送到邮箱', code: code });
    } catch (err) {
      console.error('Email send error:', err);
      // Fallback: still return code for testing
      console.log('Fallback code for ' + phone + ': ' + code);
      res.json({ success: true, message: '验证码已发送（测试环境：' + code + '）' });
    }
  } else {
    // Phone SMS (mock for now, can integrate with Alibaba Cloud SMS)
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ error: '请输入正确的手机号' });
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    codeStore.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 });
    console.log('SMS code for ' + phone + ': ' + code);
    res.json({ success: true, message: '验证码已发送', code: code }); // Return code in dev
  }
});

// Login/Register
router.post('/login', async (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ error: '请输入手机号/邮箱和验证码' });
  }

  // Verify code
  const stored = codeStore.get(phone);
  if (!stored || stored.code !== code || stored.expires < Date.now()) {
    return res.status(400).json({ error: '验证码错误或已过期' });
  }
  codeStore.delete(phone);

  try {
    let result = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let user;
    
    if (result.rows.length === 0) {
      await pool.query('INSERT INTO users (phone, credits) VALUES (?, ?)', [phone, 20]);
      result = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    }
    user = result.rows[0];

    const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    res.json({
      success: true,
      token,
      user: { id: user.id, phone: user.phone, credits: user.credits }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// Get user info
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '未登录' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, phone, credits, created_at FROM users WHERE id = ?', [decoded.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: '用户不存在' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ error: '登录已过期' });
  }
});

module.exports = router;
