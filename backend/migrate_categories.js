const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelryDB';

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for migration...');

    const result = await Product.updateMany(
      { category: 'Jewelry Sets' },
      { $set: { category: 'Others' } }
    );

    console.log(`Migration complete. Updated ${result.modifiedCount} products from 'Jewelry Sets' to 'Others'.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
