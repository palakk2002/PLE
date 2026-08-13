import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['development', 'automation', 'marketing'], required: true },
    icon: { type: String, default: 'Laptop' },
    image: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    statLabel: { type: String },
    statValue: { type: String },
    clientUrl: { type: String }
}, { timestamps: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
