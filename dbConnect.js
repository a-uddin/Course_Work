// dbConnect.js
const mongoose = require('mongoose');

// Define the connectDB function to establish a MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://lenin3636:coursework1@cluster0.k7xh5.mongodb.net/FootballDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the connectDB function
module.exports = connectDB;
