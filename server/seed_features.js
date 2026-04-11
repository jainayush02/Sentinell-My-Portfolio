import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentinell_portfolio';

async function ingestFeatures() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const portfolios = await db.collection('portfolios').find().toArray();
    
    if (portfolios.length > 0) {
      const portfolioId = portfolios[0]._id;
      const defaultFeatures = [
        { title: "Generative AI", description: "Architecting LLM-powered systems and RAG pipelines for enterprise intelligence.", icon: "Zap" },
        { title: "Full-Stack Ops", description: "Deploying high-density, performant web applications using modern React & Node stacks.", icon: "Terminal" },
        { title: "Cloud Systems", description: "Optimizing cloud-native infrastructure for maximum vertical and horizontal scale.", icon: "Code2" },
        { title: "Strategic Design", description: "Implementing data-driven UI/UX strategies that drive user retention and growth.", icon: "Users" }
      ];

      await db.collection('portfolios').updateOne(
        { _id: portfolioId },
        { $set: { features: defaultFeatures } }
      );
      
      console.log('✅ Ingestion Successful: 4 High-Impact Features committed to Portfolio Registry.');
    } else {
      console.log('❌ Registry Entry Not Found.');
    }
  } catch (err) {
    console.error('❌ Ingestion Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

ingestFeatures();
