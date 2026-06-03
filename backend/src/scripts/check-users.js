import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Connecting to:", mongoUri);
    // If Atlas fails, we connect to local DB
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB!");
    
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, Company: ${u.companyName}, Role: ${u.role}, Status: ${u.verificationStatus}`);
    });
    
    mongoose.connection.close();
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};

checkUsers();
