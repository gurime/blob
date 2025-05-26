//db/Connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables for standalone Node.js/Express app
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MongoDB URI is undefined. Please check your .env file.');
  console.error('Expected: MONGODB_URI=mongodb://localhost:27017/your-database-name');
  process.exit(1);
}

// Connection state tracking
let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
    
    const connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: true, // Enable command buffering
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${connection.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });

    return connection.connection;
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    
    // More specific error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Make sure MongoDB is running on your system');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Tip: Check your MongoDB username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Tip: Check your MongoDB connection string');
    }
    
    process.exit(1);
  }
};

export default connectDB;