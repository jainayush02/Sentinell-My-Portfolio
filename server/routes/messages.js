import express from 'express';
import { Message } from '../models/Message.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
