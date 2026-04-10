import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:MxlCxbt3mmP1hxtu@senitel.m9hvy2k.mongodb.net/sentinel?retryWrites=true&w=majority';

async function clean() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Cleaning portfolio collection...');
    await mongoose.connection.db.dropCollection('portfolios');
    console.log('✅ Collection cleaned successfully.');
  } catch (err) {
    if (err.codeName === 'NamespaceNotFound') {
      console.log('Collection already empty or not found. No action needed.');
    } else {
      console.error('❌ Error cleaning database:', err);
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

clean();
