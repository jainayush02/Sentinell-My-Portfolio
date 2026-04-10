import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Portfolio } from './models/Portfolio.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:MxlCxbt3mmP1hxtu@senitel.m9hvy2k.mongodb.net/sentinel?retryWrites=true&w=majority';

async function update() {
  try {
    await mongoose.connect(MONGODB_URI);
    let portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (portfolio) {
      console.log('Current Career Start Date:', portfolio.profile.careerStartDate);
      portfolio.profile.careerStartDate = '2023-01-01';
      portfolio.markModified('profile'); // Ensure Mongoose sees the change
      await portfolio.save();
      console.log('✅ Updated Career Start Date to 2023-01-01');
    } else {
      console.log('⚠️ No portfolio found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

update();
