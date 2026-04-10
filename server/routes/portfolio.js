import express from 'express';
import { Portfolio } from '../models/Portfolio.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get portfolio data
router.get('/', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      return res.status(404).json({ message: 'No portfolio data found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update portfolio data
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    // We update the existing one or create a new one if none exists
    let portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    
    if (portfolio) {
      // Update existing
      portfolio.set(data);
      portfolio.markModified('profile');
      await portfolio.save();
    } else {
      // Create new
      portfolio = new Portfolio(data);
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
