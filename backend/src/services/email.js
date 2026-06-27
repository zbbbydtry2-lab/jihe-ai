const nodemailer = require('nodemailer');

async function sendVerificationEmail(to, code) {
  // Use environment variables or fallback to a test transporter
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@jiheai.com',
      to,
      subject: '几何AI - 验证码',
      html: `
        <div style="max-width:480px;margin:0 auto;padding:32px;font-family:Arial,sans-serif">
          <h2 style="color:#1a1a2e">几何AI 验证码</h2>
          <p>您的验证码是：</p>
          <div style="background:#f4f6f9;padding:20px;border-radius:12px;text-align:center;margin:20px 0">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a1a2e">${code}</span>
          </div>
          <p style="color:#666;font-size:13px">验证码 5 分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    });
    return true;
  }
  
  // No SMTP configured - log code for development
  console.log('[DEV] Email verification code for ' + to + ': ' + code);
  return true;
}

module.exports = { sendVerificationEmail };
