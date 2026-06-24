import mongoose from 'mongoose';
import Order from './src/models/Order.model.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://somiljoshi7047_db_user:somil%402134@appzetoproject.0sufkk6.mongodb.net/?appName=AppzetoProject').then(async () => {
    // Update the recent order to point to Shashank's User ID
    const result = await Order.updateOne(
        { userId: '6a366e086f047524f73216da' }, // Rohan's ID
        { $set: { userId: '6a362c2f47c558521bcbc23e' } } // Shashank's ID
    );
    console.log('Order transferred:', result.modifiedCount);
    mongoose.disconnect();
});
