const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const connectDB = async () => {
  try {
    console.log("🔍 Connecting to MongoDB URI:", process.env.MONGO_URI); // Debugging
    await mongoose.connect(process.env.MONGODB_URI); // No need for deprecated options
    console.log('✅ MongoDB Connected...');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
