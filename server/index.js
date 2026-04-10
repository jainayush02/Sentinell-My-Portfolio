import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import portfolioRoutes from './routes/portfolio.js';
import authRoutes from './routes/auth.js';
import messagesRoutes from './routes/messages.js';
import { authenticateToken } from './middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import twilio from 'twilio';
import mongoSanitize from 'express-mongo-sanitize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentinal_portfolio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 🛡️ SECURITY HARDENING: Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 🛡️ SECURITY HARDENING: CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    // Allow Vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('🛡️ SENTINAL SECURITY: Origin Not Authorized'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// 🛡️ SECURITY HARDENING: NoSQL Injection Protection
app.use(mongoSanitize());
app.use(morgan('dev'));

// 🛡️ SECURITY HARDENING: Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 OTP requests per hour
  message: { message: 'Too many login attempts. Please try again in an hour.' }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 messages
  message: { message: 'Too many messages sent. Please try again later.' }
});

// Static folder for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|pdf|docx|doc/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Only Images, PDFs and Word docs are allows!'));
  }
});

// 🛡️ SECURE Upload Endpoint (Requires Admin Token)
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const API_BASE = '/api';
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ DATABASE: Secure connection active'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Models
import { Message } from './models/Message.js';

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/auth', loginLimiter, authRoutes); // Apply rate limiter to login
app.use('/api/messages', messagesRoutes);

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();
    console.log(`📩 INQUIRY: New message from ${name}`);

    // ✉️ Minimalist Personal WhatsApp Notification
    try {
      await twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}`,
        body: `Hi Ayush,\n\n` +
              `You received a new message via your *Sentinel Portfolio*.\n\n` +
              `*Details:*\n` +
              `• Name: ${name}\n` +
              `• Email: ${email}\n` +
              `• Subject: ${subject}\n\n` +
              `*Message:*\n` +
              `${message}`
      });
      console.log('📱 NOTIFY: WhatsApp dispatched');
    } catch (twilioErr) {
      console.error('⚠️ Twilio dispatch failed.', twilioErr.message);
    }

    res.status(200).json({ message: 'Message received successfully' });
  } catch (err) {
    console.error('❌ Contact error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log('🛡️ SENTINAL SHIELD: ACTIVE');
  console.log(`🚀 SERVICE: Listening on Port ${PORT}`);
});

export default app;
