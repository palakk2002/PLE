import 'dotenv/config';
import connectDB from './src/config/db.js';
import mongoose from 'mongoose';

console.log("Starting DB connection test...");
connectDB().then(() => {
  console.log("connectDB function finished execution.");
  process.exit(0);
}).catch(err => {
  console.error("connectDB threw an unhandled error:", err);
  process.exit(1);
});
