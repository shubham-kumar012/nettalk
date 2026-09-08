const mongoose = require('mongoose');

// Connect to MongoDB (to be used in later phases)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nettalk');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't exit process in Phase 1 so server can run standalone
  }
};

module.exports = connectDB;
