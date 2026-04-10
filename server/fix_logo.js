import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:MxlCxbt3mmP1hxtu@senitel.m9hvy2k.mongodb.net/sentinel?retryWrites=true&w=majority';

async function fix() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('portfolios').updateMany(
      {},
      { $set: { "profile.logoUrl": "/logo.png" } }
    );
    console.log(`Updated ${result.modifiedCount} portfolios to use /logo.png`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fix();
