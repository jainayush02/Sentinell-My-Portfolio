import express from 'express';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { OtpStore } from '../models/OtpStore.js';
import { Portfolio } from '../models/Portfolio.js';

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const isProduction = process.env.NODE_ENV === 'production';

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  const normalizedInput = phoneNumber.replace(/[\s\-()]/g, '');
  const normalizedAdmin = (process.env.ADMIN_PHONE_NUMBER || '').replace(/[\s\-()]/g, '');

  if (normalizedInput !== normalizedAdmin) {
    console.log(`Security alert: unauthorized login attempt from ${normalizedInput}`);
    return res.status(403).json({ message: 'Unauthorized phone number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  if (!isProduction) {
    console.log('\nSentinell auth access ----------------------');
    console.log(`Phone: [${phoneNumber}]`);
    console.log(`OTP: [${otp}]`);
    console.log('-------------------------------------------\n');
  }

  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      await client.messages.create({
        body: `Your Sentinell Portfolio login OTP is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      console.log('OTP delivery dispatched via Twilio');
    } else if (!isProduction) {
      console.log('Twilio credentials missing. Delivery skipped; OTP is available in the local console.');
    }

    await OtpStore.findOneAndUpdate(
      { phoneNumber },
      { otp, expiry, attempts: 0 },
      { upsert: true, new: true }
    );

    res.json({ message: isProduction ? 'OTP generated successfully.' : 'OTP generated. Check server console for code.' });
  } catch (error) {
    console.error('Twilio logic error:', error.message);

    await OtpStore.findOneAndUpdate(
      { phoneNumber },
      { otp, expiry, attempts: 0 },
      { upsert: true, new: true }
    );

    res.json({ message: isProduction ? 'OTP generated successfully.' : 'OTP generated. Check server console for code.' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const storedData = await OtpStore.findOne({ phoneNumber });

  if (!storedData) {
    return res.status(400).json({ message: 'OTP not requested or expired' });
  }

  if (new Date() > storedData.expiry) {
    await OtpStore.deleteOne({ phoneNumber });
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (storedData.otp !== otp) {
    storedData.attempts += 1;

    if (storedData.attempts >= 3) {
      await OtpStore.deleteOne({ phoneNumber });
      return res.status(403).json({ message: 'Too many attempts. Request a new OTP.' });
    }

    await storedData.save();
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  await OtpStore.deleteOne({ phoneNumber });

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Authentication is not configured correctly' });
  }

  const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Generate SSO Magic Link
router.get('/sso-url', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    let workLink = portfolio?.profile?.workLink || 'https://www.kryonex.dev/portal';

    workLink = workLink.split('?')[0];

    const fullUrl = workLink.startsWith('http') ? workLink : `https://${workLink}`;

    if (!process.env.SSO_SHARED_SECRET) {
      return res.json({ url: fullUrl });
    }

    const ssoToken = jwt.sign(
      {
        role: 'portfolio_visitor',
        origin: 'sentinell',
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.SSO_SHARED_SECRET,
      { expiresIn: '1m' }
    );

    const ssoUrl = `${fullUrl}?sso_token=${ssoToken}`;
    res.json({ url: ssoUrl });
  } catch (error) {
    console.error('SSO generation error:', error);
    res.status(500).json({ message: 'Failed to generate SSO uplink' });
  }
});

export default router;
