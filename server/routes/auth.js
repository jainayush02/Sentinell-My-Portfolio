import express from 'express';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { OtpStore } from '../models/OtpStore.js';

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  if (phoneNumber !== process.env.ADMIN_PHONE_NUMBER) {
    return res.status(403).json({ message: 'Unauthorized phone number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    await client.messages.create({
      body: `Your Sentinell Portfolio login OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    // Update or create OTP record
    await OtpStore.findOneAndUpdate(
      { phoneNumber },
      { otp, expiry, attempts: 0 },
      { upsert: true, new: true }
    );

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  const storedData = await OtpStore.findOne({ phoneNumber });

  if (!storedData) {
    return res.status(400).json({ message: 'OTP not requested or expired' });
  }

  // Check if expired (though TTL should handle cleanup, explicit check is safer)
  if (new Date() > storedData.expiry) {
    await OtpStore.deleteOne({ phoneNumber });
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (storedData.otp !== otp) {
    // Increment attempts
    storedData.attempts += 1;
    
    if (storedData.attempts >= 3) {
      await OtpStore.deleteOne({ phoneNumber });
      return res.status(403).json({ message: 'Too many attempts. Request a new OTP.' });
    }
    
    await storedData.save();
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Clear OTP on success
  await OtpStore.deleteOne({ phoneNumber });

  // Generate JWT
  const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

export default router;
