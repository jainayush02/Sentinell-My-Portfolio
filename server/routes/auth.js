import express from 'express';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { OtpStore } from '../models/OtpStore.js';
import { Portfolio } from '../models/Portfolio.js';

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  // 🛡️ SECURITY: Normalize phone numbers for robust comparison (remove spaces/dashes)
  const normalizedInput = phoneNumber.replace(/[\s\-()]/g, '');
  const normalizedAdmin = (process.env.ADMIN_PHONE_NUMBER || '').replace(/[\s\-()]/g, '');

  if (normalizedInput !== normalizedAdmin) {
    console.log(`🛡️ SECURITY ALERT: Unauthorized login attempt from ${normalizedInput} (Expected: ${normalizedAdmin})`);
    return res.status(403).json({ message: 'Unauthorized phone number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // 🛡️ SECURITY & DEV CONSOLE: Always log OTP to server terminal for easy debugging
  console.log(`\n🛡️ SENTINELL AUTH ACCESS: ----------------------`);
  console.log(`📱 NODE: [${phoneNumber}]`);
  console.log(`🔑 SECURITY TOKEN: [${otp}]`);
  console.log(`-----------------------------------------------\n`);

  try {
    // Attempt Twilio delivery
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      await client.messages.create({
        body: `Your Sentinell Portfolio login OTP is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      console.log('📱 NOTIFY: Delivery dispatched via Twilio');
    } else {
      console.log('⚠️ NOTIFY: Twilio credentials missing. Delivery skipped (OTP printed to console).');
    }

    // Update or create OTP record
    await OtpStore.findOneAndUpdate(
      { phoneNumber },
      { otp, expiry, attempts: 0 },
      { upsert: true, new: true }
    );

    res.json({ message: 'OTP generated. Check server console for code.' });
  } catch (error) {
    console.error('Twilio Logic Error:', error.message);
    
    // In dev/non-prod, we still proceed even if Twilio fails as long as we have the OTP in console
    await OtpStore.findOneAndUpdate(
      { phoneNumber },
      { otp, expiry, attempts: 0 },
      { upsert: true, new: true }
    );

    res.json({ message: 'OTP generated. Check server console for code.' });
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

// Generate SSO Magic Link
router.get('/sso-url', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    // Default to the provided target if workLink is not set
    let workLink = portfolio?.profile?.workLink || 'https://www.kryonex.dev/portal';
    
    // Ensure clean URL for appending params
    workLink = workLink.split('?')[0];

    // Generate a short-lived SSO token
    const ssoToken = jwt.sign(
      { 
        role: 'portfolio_visitor', 
        origin: 'sentinell',
        iat: Math.floor(Date.now() / 1000)
      }, 
      process.env.SSO_SHARED_SECRET, 
      { expiresIn: '1m' } // Very short lived for security
    );

    const fullUrl = workLink.startsWith('http') ? workLink : `https://${workLink}`;
    const ssoUrl = `${fullUrl}?sso_token=${ssoToken}`;
    
    res.json({ url: ssoUrl });
  } catch (error) {
    console.error('SSO Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate SSO uplink' });
  }
});

export default router;
