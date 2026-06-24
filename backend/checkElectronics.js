import mongoose from 'mongoose';
import Product from './src/models/Product.model.js';
import Category from './src/models/Category.model.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://somiljoshi7047_db_user:somil%402134@appzetoproject.0sufkk6.mongodb.net/?appName=AppzetoProject').then(async () => {
    const category = await Category.findOne({ slug: 'electronics' });
    console.log('Electronics Category ID:', category?._id);
    const products = await Product.find({ categoryId: category?._id }).select('name isActive b2bEnabled slug');
    console.log(`Products in Electronics (${products.length}):`);
    products.forEach(p => console.log(` - ${p.name} (isActive: ${p.isActive}, b2bEnabled: ${p.b2bEnabled})`));
    mongoose.disconnect();
});
