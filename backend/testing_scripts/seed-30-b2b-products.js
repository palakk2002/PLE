import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Mongoose Models
import Vendor from '../src/models/Vendor.model.js';
import Category from '../src/models/Category.model.js';
import Brand from '../src/models/Brand.model.js';
import Product from '../src/models/Product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const B2B_CATEGORIES = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Office Furniture', slug: 'office-furniture' },
    { name: 'Corporate Gifts', slug: 'corporate-gifts' }
];

const generateProducts = (vendor, brands, categories) => {
    const products = [];

    // Electronics (10 items)
    const electronicsItems = [
        { name: 'Dell XPS 15 (Corporate Config)', price: 150000, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' },
        { name: 'ThinkPad T14 Gen 3', price: 120000, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80' },
        { name: 'Logitech MX Master 3S', price: 9000, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
        { name: 'Samsung 27" 4K Monitor', price: 35000, image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500&q=80' },
        { name: 'Apple MacBook Pro M3', price: 200000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
        { name: 'Jabra Evolve2 65 Headset', price: 18000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' },
        { name: 'Keychron K8 Pro Keyboard', price: 11000, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
        { name: 'Logitech Brio 4K Webcam', price: 15000, image: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?w=500&q=80' },
        { name: 'Belkin Thunderbolt 4 Dock', price: 30000, image: 'https://images.unsplash.com/photo-1600861195091-690c92f1d224?w=500&q=80' },
        { name: 'APC UPS 1000VA', price: 12000, image: 'https://images.unsplash.com/photo-1592398579458-9580bbf23e59?w=500&q=80' }
    ];

    electronicsItems.forEach((item, index) => {
        products.push(createB2BProduct(item, vendor, brands.tech, categories.electronics, index + 1));
    });

    // Office Furniture (10 items)
    const furnitureItems = [
        { name: 'Herman Miller Aeron Chair', price: 120000, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
        { name: 'Steelcase Gesture Chair', price: 95000, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80' },
        { name: 'Motorized Standing Desk', price: 45000, image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&q=80' },
        { name: 'L-Shaped Executive Desk', price: 55000, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
        { name: 'Acoustic Office Partition', price: 15000, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80' },
        { name: 'Ergonomic Footrest', price: 3000, image: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?w=500&q=80' },
        { name: 'Conference Room Table (8 Seater)', price: 85000, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&q=80' },
        { name: 'Storage Cabinet/Credenza', price: 25000, image: 'https://images.unsplash.com/photo-1595514535415-88a44d8b92b6?w=500&q=80' },
        { name: 'Lounge Reception Sofa', price: 60000, image: 'https://images.unsplash.com/photo-1540574163026-643ea20d25b5?w=500&q=80' },
        { name: 'Monitor Arm (Dual Display)', price: 8000, image: 'https://images.unsplash.com/photo-1542487354-feaf93476caa?w=500&q=80' }
    ];

    furnitureItems.forEach((item, index) => {
        products.push(createB2BProduct(item, vendor, brands.office, categories.furniture, index + 1));
    });

    // Corporate Gifts (10 items)
    const giftsItems = [
        { name: 'Premium Leather Planner', price: 2500, image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80' },
        { name: 'Stainless Steel Insulated Flask', price: 1500, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80' },
        { name: 'Cross Executive Pen Set', price: 3500, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80' },
        { name: 'Wireless Charging Pad', price: 2000, image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&q=80' },
        { name: 'Employee Welcome Box', price: 5000, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80' },
        { name: 'Noise Cancelling Earbuds', price: 8000, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
        { name: 'Smart Coffee Mug', price: 9000, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
        { name: 'Corporate Duffle Bag', price: 4000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
        { name: 'Bluetooth Tracker Tag', price: 2500, image: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=500&q=80' },
        { name: 'Eco-Friendly Bamboo Notebook', price: 1200, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80' }
    ];

    giftsItems.forEach((item, index) => {
        products.push(createB2BProduct(item, vendor, brands.office, categories.gifts, index + 1));
    });

    return products;
};

const createB2BProduct = (item, vendor, brand, category, idSuffix) => {
    const slug = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idSuffix}`;
    const b2bWholesalePrice = Math.floor(item.price * 0.85); // 15% discount base
    return {
        name: item.name,
        slug: slug,
        description: `High-quality ${item.name} suitable for enterprise and bulk usage.`,
        price: item.price,
        originalPrice: Math.floor(item.price * 1.2),
        unit: 'Piece',
        image: item.image,
        categoryId: category._id,
        brandId: brand._id,
        vendorId: vendor._id,
        stock: 'in_stock',
        stockQuantity: 1000,
        minimumOrderQuantity: 1,
        b2bEnabled: true,
        b2bWholesalePrice: b2bWholesalePrice,
        b2bMinOrderQty: 5,
        b2bBulkPricingSlabs: [
            { minQty: 1, maxQty: 10, pricePerUnit: b2bWholesalePrice },
            { minQty: 11, maxQty: 50, pricePerUnit: Math.floor(item.price * 0.75) }, // 25% discount
            { minQty: 51, maxQty: null, pricePerUnit: Math.floor(item.price * 0.65) } // 35% discount
        ],
        isActive: true
    };
};

const seedBulkProducts = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appzeto';
        console.log('Connecting to MongoDB...', uri.replace(/:([^:@]{3,})@/, ':***@'));
        await mongoose.connect(uri);
        console.log('Connected to MongoDB.');

        // 1. Get or Create Vendor
        let vendor = await Vendor.findOne({ email: 'wholesale@techgear.com' });
        if (!vendor) {
            vendor = await Vendor.findOne(); // Fallback to any vendor
        }
        if (!vendor) {
            console.error("No vendor found in the database. Please run seed-b2b-products.js first to create the base vendor.");
            return;
        }

        // 2. Get or Create Categories
        const categories = {};
        for (const cat of B2B_CATEGORIES) {
            categories[cat.slug.replace('-', '')] = await Category.findOneAndUpdate(
                { slug: cat.slug },
                { name: cat.name, slug: cat.slug, isActive: true },
                { upsert: true, new: true }
            );
        }
        console.log('Categories ensured.');

        // 3. Get or Create Brands
        const techGearBrand = await Brand.findOneAndUpdate(
            { slug: 'tech-gear-pro' },
            { name: 'Tech Gear Pro', slug: 'tech-gear-pro', isActive: true },
            { upsert: true, new: true }
        );
        const officeProBrand = await Brand.findOneAndUpdate(
            { slug: 'office-pro-plus' },
            { name: 'Office Pro Plus', slug: 'office-pro-plus', isActive: true },
            { upsert: true, new: true }
        );
        console.log('Brands ensured.');

        // 4. Generate Products Data
        const productsData = generateProducts(
            vendor, 
            { tech: techGearBrand, office: officeProBrand }, 
            { electronics: categories.electronics, furniture: categories.officefurniture, gifts: categories.corporategifts }
        );

        // 5. Insert Products
        for (const pd of productsData) {
            await Product.findOneAndUpdate(
                { slug: pd.slug },
                pd,
                { upsert: true, new: true }
            );
            console.log(`Upserted Product: ${pd.name}`);
        }

        console.log(`Successfully seeded ${productsData.length} B2B products!`);

    } catch (error) {
        console.error('Seeding Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedBulkProducts();
