// SMS service integration placeholder
// In production, integrate with Alibaba Cloud SMS, Twilio, etc.

async function sendVerificationCode(phone) {
  // Mock: always return code 123456
  console.log(`Sending verification code to ${phone}: 123456`);
  return { success: true, code: '123456' };
}

async function verifyCode(phone, code) {
  // Mock: accept 123456
  return code === '123456';
}

module.exports = { sendVerificationCode, verifyCode };
