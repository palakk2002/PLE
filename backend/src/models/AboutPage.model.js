import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
}, { _id: true });

const edgeStepSchema = new mongoose.Schema({
    step: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: true });

const aboutCompanyFeatureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true }
}, { _id: true });

const aboutPageSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: 'Shopping Made Simple' },
        subtitle: { type: String, default: 'Powered by Trust & Convenience' },
        description: { type: String, default: 'PLE (Peoples League of Electronics) is a customer-first shopping app built to bring electronics, fashion, home essentials, beauty, wellness, sports, and daily needs into one smooth marketplace.' },
        secureStatValue: { type: String, default: '99%' },
        secureStatLabel1: { type: String, default: 'Secure' },
        secureStatLabel2: { type: String, default: 'Checkout' },
        categoryStatValue: { type: String, default: '25+' },
        categoryStatLabel1: { type: String, default: 'Product' },
        categoryStatLabel2: { type: String, default: 'Categories' },
        teamImg: { type: String, default: '/sho5.jpg' }
    },
    aboutCompany: {
        title1: { type: String, default: 'Helping People Shop' },
        title2: { type: String, default: 'With Better Deals & Trusted Sellers' },
        paragraphs: { type: [String], default: [
            "At **PLE (Peoples League of Electronics)**, we believe technology isn't just about code — it's about creating meaningful impact.",
            "We are a **next-generation shopping marketplace** helping customers discover quality products, compare better deals, and buy from trusted sellers with secure checkout.",
            "Founded with a vision to **bring everyday shopping into one reliable app**, PLE connects shoppers with electronics, lifestyle, home, wellness, sports, and essential products.",
            "Our team works to make product discovery, payments, delivery updates, returns, and support smoother from the first search to the final doorstep delivery."
        ]},
        features: { type: [aboutCompanyFeatureSchema], default: [
            { title: 'Trusted Shopping', description: 'Secure checkout, verified seller listings, and clear product information.', iconName: 'ShieldCheck' },
            { title: 'Customer Value', description: 'Daily deals, easy returns, and helpful support for a better shopping journey.', iconName: 'AwardIcon' }
        ]},
        founderName: { type: String, default: 'Rakesh Kumar' },
        founderRole: { type: String, default: 'Founder, PLE Shopping Marketplace' },
        compImg1: { type: String, default: '/sho1.jpg' },
        compImg2: { type: String, default: '/sho.jpg' },
        yearsOfExcellence: { type: String, default: '5+' }
    },
    whatWeDo: {
        title: { type: String, default: 'Everything A Shopping App Needs' },
        description: { type: String, default: 'PLE (Peoples League of Electronics) brings product discovery, trusted sellers, secure payments, delivery updates, deals, and support together in one shopping app.' },
        services: { type: [featureSchema], default: [
            { title: 'Smart Shopping Experience', description: 'A fast, mobile-friendly shopping journey built for browsing, comparing, saving, and checking out with confidence.', icon: 'Code' },
            { title: 'Curated Product Categories', description: 'Electronics, fashion, home, beauty, wellness, sports, and daily essentials organized for quick discovery.', icon: 'Share2' },
            { title: 'Deals & Savings', description: 'Daily offers, seasonal drops, bundle savings, and clear pricing so shoppers can find better value faster.', icon: 'Megaphone' },
            { title: 'Verified Sellers', description: 'Trusted seller listings, product clarity, ratings, and transparent details for a safer marketplace experience.', icon: 'Palette' },
            { title: 'Secure Payments', description: 'Protected checkout flows and clear order confirmation designed to make every purchase feel safe.', icon: 'Calculator' },
            { title: 'Order Tracking', description: 'Simple delivery updates from cart to doorstep, with support when an order needs extra attention.', icon: 'BarChart3' },
            { title: 'Easy Returns & Support', description: 'Clear return guidance and helpful customer support for payments, delivery, product issues, and replacements.', icon: 'Cpu' }
        ]}
    },
    vision: {
        title: { type: String, default: 'Make Everyday Shopping Easier' },
        description: { type: String, default: 'To become a trusted shopping app where customers can discover quality products, compare better deals, and shop confidently from verified sellers.' }
    },
    mission: {
        title: { type: String, default: 'Bringing Value To Every Cart' },
        description: { type: String, default: 'To make online shopping faster, safer, and more transparent through curated categories, secure payments, delivery updates, easy returns, and helpful support.' }
    },
    ourEdge: {
        title: { type: String, default: 'Why Shoppers Trust PLE (Peoples League of Electronics)' },
        description: { type: String, default: 'We make shopping simpler by combining curated products, verified sellers, clear pricing, secure checkout, and reliable support under one marketplace.' },
        steps: { type: [edgeStepSchema], default: [
            { step: '01', title: 'Curated Categories', description: 'Shop electronics, fashion, home, beauty, wellness, sports, and essentials in one app.' },
            { step: '02', title: 'Verified Sellers', description: 'Clear product listings, trusted seller information, and transparent buying details.' },
            { step: '03', title: 'Secure Checkout', description: 'Protected payments, order confirmation, and smooth tracking after purchase.' },
            { step: '04', title: 'Easy Support', description: 'Helpful assistance for delivery updates, returns, replacements, and order questions.' }
        ]}
    }
}, { timestamps: true });

export default mongoose.models.AboutPage || mongoose.model('AboutPage', aboutPageSchema);
