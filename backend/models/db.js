const mongoose = require('mongoose');
const { mongoURI } = require('./config');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
    const db = connection.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    // Check if 'shorts' collection exists, if not create it
    if (!collections.some(col => col.name === 'shorts')) {
      await db.createCollection('shorts');
      console.log('Created "shorts" collection.');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
