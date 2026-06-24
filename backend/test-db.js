import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
  const data = await Order.find({ isDeleted: { $ne: true }, status: { $ne: 'cancelled' } }).select('createdAt total').lean();
  console.log(data);
  process.exit(0);
});
