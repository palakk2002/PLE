import mongoose from 'mongoose';
import User from './src/models/User.model.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://somiljoshi7047_db_user:somil%402134@appzetoproject.0sufkk6.mongodb.net/?appName=AppzetoProject').then(async () => {
    const user = await User.findById('6a366e086f047524f73216da').lean();
    console.log(JSON.stringify(user, null, 2));
    mongoose.disconnect();
});
