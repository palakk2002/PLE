import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
    numericValue: { type: Number, required: true },
    suffix: { type: String, default: '' },
    label: { type: String, required: true },
    desc: { type: String, required: true },
    iconName: { type: String, required: true }
}, { _id: true });

const ctaFeatureSchema = new mongoose.Schema({
    text: { type: String, required: true },
    iconName: { type: String, required: true }
}, { _id: true });

const portfolioPageSchema = new mongoose.Schema({
    hero: {
        title1: { type: String, default: 'Proven Engineering Standards' },
        title2: { type: String, default: '& Strategic Growth' },
        subtitle: { type: String, default: 'Success Showcases' },
        description: { type: String, default: 'Explore our real-world portfolio of partnerships across India. From full-scale multivendor e-commerce hubs and automated inventory sync tools, to organic shopping SEO domination and high-converting retail user experience (UX) pipelines.' }
    },
    metrics: {
        title: { type: String, default: 'Concrete Metrics. Exceptional Outcomes.' },
        subtitle: { type: String, default: 'Demonstrated Proof' },
        description: { type: String, default: 'We focus on measurable statistics. From performance scores and user acquisition speeds, to manual administrative hours eliminated.' },
        list: { type: [metricSchema], default: [
            { numericValue: 140, suffix: '+', label: 'E-commerce Hubs Launched', desc: 'Secure digital storefronts and multivendor marketplaces.', iconName: 'Zap' },
            { numericValue: 99, suffix: '%', label: 'Order Delivery Success Rate', desc: 'Smooth shipping updates from checkout to doorstep.', iconName: 'Award' },
            { numericValue: 300, suffix: '%+', label: 'Average Conversions Growth', desc: 'Acquisition increase across digital shopping funnels.', iconName: 'Share2' },
            { numericValue: 25, suffix: ' Hrs', label: 'Saved per Week', desc: 'Through automated logistics, shipping and stock sync.', iconName: 'Database' }
        ]}
    },
    cta: {
        title1: { type: String, default: 'Ready to Build Your' },
        title2: { type: String, default: 'Digital Legacy?' },
        subtitle: { type: String, default: "Let's Collaborate" },
        features: { type: [ctaFeatureSchema], default: [
            { text: 'Free Visual Mockup Draft', iconName: 'Sparkles' },
            { text: 'Direct Engineering Channel', iconName: 'Laptop' },
            { text: 'High-Performance Launch', iconName: 'Zap' }
        ]},
        buttonText: { type: String, default: 'Start a Project' },
        buttonLink: { type: String, default: '/get-quote' }
    }
}, { timestamps: true });

export default mongoose.model('PortfolioPage', portfolioPageSchema);
