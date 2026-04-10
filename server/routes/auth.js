import express from 'express';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// In-memory OTP storage for simplicity
// In production, use Redis or a DB collection
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  if (phoneNumber !== process.env.ADMIN_PHONE_NUMBER) {
    return res.status(403).json({ message: 'Unauthorized phone number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  try {
    await client.messages.create({
      body: `Your Sentinell Studio Portfolio login OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    otpStore.set(phoneNumber, { otp, expiry });
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const storedData = otpStore.get(phoneNumber);

  if (!storedData) {
    return res.status(400).json({ message: 'OTP not requested or expired' });
  }

  if (Date.now() > storedData.expiry) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Clear OTP
  otpStore.delete(phoneNumber);

  // Generate JWT
  const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

export default router;
