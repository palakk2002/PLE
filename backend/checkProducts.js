import mongoose from 'mongoose';
import Product from './src/models/Product.model.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://somiljoshi7047_db_user:somil%402134@appzetoproject.0sufkk6.mongodb.net/?appName=AppzetoProject').then(async () => {
    const total = await Product.countDocuments();
    console.log('Total Products:', total);
    
    // Group products by category ID
    const categoryCounts = await Product.aggregate([
        { $group: { _id: '$categoryId', count: { $sum: 1 } } }
    ]);
    console.log('Counts by Category ID:', categoryCounts);
    
    mongoose.disconnect();
});
