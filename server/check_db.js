import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:MxlCxbt3mmP1hxtu@senitel.m9hvy2k.mongodb.net/sentinel?retryWrites=true&w=majority';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const portfolios = await db.collection('portfolios').find().toArray();
    if (portfolios.length > 0) {
      console.log('Profile Data in DB:', JSON.stringify(portfolios[0].profile, null, 2));
    } else {
      console.log('⚠️ DATABASE IS EMPTY');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

check();
