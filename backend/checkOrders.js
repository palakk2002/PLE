import mongoose from 'mongoose';
import Order from './src/models/Order.model.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://somiljoshi7047_db_user:somil%402134@appzetoproject.0sufkk6.mongodb.net/?appName=AppzetoProject').then(async () => {
    const orders = await Order.find().lean();
    console.log(JSON.stringify(orders, null, 2));
    mongoose.disconnect();
});
