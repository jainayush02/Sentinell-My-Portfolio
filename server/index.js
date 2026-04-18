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
import { fileTypeFromBuffer } from 'file-type';
import { Readable } from 'stream';
import twilio from 'twilio';
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

let bucket; // GridFS bucket

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
    // Allow specific Sentinell Studio deployment
    if (origin.includes('sentinell-studio.vercel.app') || origin.includes('sentinell.kryonex.dev')) {
      return callback(null, true);
    }
    callback(new Error('🛡️ SENTINELL SECURITY: Origin Not Authorized'));
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

// Multer Memory Storage (Required for GridFS/file-type)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|pdf|docx|doc/;
    // We still check extension for quick rejection
    const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Only images, PDFs and Word documents are allowed.'));
  }
});

// 🛡️ File Retrieval Route (GridFS)
app.get('/api/files/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }

    const _id = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id }).toArray();
    
    if (files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// 🛡️ SECURE Upload Endpoint (GridFS + Real Type Check)
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // FIX 3: Verify real magic bytes
  const type = await fileTypeFromBuffer(req.file.buffer);
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  
  if (!type || !allowedMimes.includes(type.mime)) {
    return res.status(400).json({ message: 'Security Alert: File type spoofing detected.' });
  }

  try {
    // FIX 4: Stream to GridFS
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: type.mime,
      metadata: { originalName: req.file.originalname }
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      res.json({ url: `/api/files/${uploadStream.id}` });
    });

    uploadStream.on('error', (err) => {
      throw err;
    });
  } catch (err) {
    console.error('GridFS Upload Error:', err);
    res.status(500).json({ message: 'Failed to store file' });
  }
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ DATABASE: Secure connection active');
    const { db } = mongoose.connection;
    bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
  })
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
    
    // FIX 5: Strict Validation
    const errors = {};
    if (!name || name.trim().length === 0) errors.name = 'Name is required';
    else if (name.length > 100) errors.name = 'Name must be under 100 chars';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.email = 'Valid email is required';

    if (!subject || subject.trim().length === 0) errors.subject = 'Subject is required';
    else if (subject.length > 200) errors.subject = 'Subject must be under 200 chars';

    if (!message || message.trim().length === 0) errors.message = 'Message is required';
    else if (message.length > 2000) errors.message = 'Message must be under 2000 chars';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
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
              `You received a new message via your *Sentinell Portfolio*.\n\n` +
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
  console.log('🛡️ SENTINELL SHIELD: ACTIVE');
  console.log(`🚀 SERVICE: Listening on Port ${PORT}`);
});

export default app;
