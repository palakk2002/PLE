import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models
import { Product } from '../src/models/Product.model.js';
import { Vendor } from '../src/models/Vendor.model.js';
import { Category } from '../src/models/Category.model.js';
import { Brand } from '../src/models/Brand.model.js';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/appzeto';

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        // 1. Create a Vendor
        let vendor = await Vendor.findOne({ email: 'wholesale@techgear.com' });
        if (!vendor) {
            vendor = await Vendor.create({
                name: 'Admin TechGear',
                email: 'wholesale@techgear.com',
                password: 'Password123!',
                phone: '9876543210',
                ownerName: 'Admin TechGear',
                storeName: 'Tech Gear Pro Wholesale',
                businessType: 'distributor',
                verificationStatus: 'approved',
                isActive: true,
                shippingEnabled: true,
                commissionRate: 5,
                b2bEnabled: true
            });
            console.log('Created Vendor: Tech Gear Pro Wholesale');
        } else {
            console.log('Vendor already exists.');
        }

        // 2. Create Categories
        const categoriesData = [
            { name: 'Electronics', slug: 'electronics', isActive: true },
            { name: 'Office Supplies', slug: 'office-supplies', isActive: true },
            { name: 'Corporate Gifts', slug: 'corporate-gifts', isActive: true }
        ];

        let electronicsCat = await Category.findOne({ slug: 'electronics' });
        if (!electronicsCat) electronicsCat = await Category.create(categoriesData[0]);
        
        let officeCat = await Category.findOne({ slug: 'office-supplies' });
        if (!officeCat) officeCat = await Category.create(categoriesData[1]);

        let giftsCat = await Category.findOne({ slug: 'corporate-gifts' });
        if (!giftsCat) giftsCat = await Category.create(categoriesData[2]);
        console.log('Categories ensured.');

        // 3. Create Brands
        const brandsData = [
            { name: 'TechGear', slug: 'techgear', isActive: true },
            { name: 'OfficePro', slug: 'officepro', isActive: true }
        ];

        let techGearBrand = await Brand.findOne({ slug: 'techgear' });
        if (!techGearBrand) techGearBrand = await Brand.create(brandsData[0]);
        
        let officeProBrand = await Brand.findOne({ slug: 'officepro' });
        if (!officeProBrand) officeProBrand = await Brand.create(brandsData[1]);
        console.log('Brands ensured.');

        // 4. Create Products
        const productsData = [
            {
                name: "Premium Corporate Laptop (Bulk Edition)",
                slug: "premium-corporate-laptop-bulk",
                description: "High-performance laptop for corporate bulk orders.",
                price: 45000,
                originalPrice: 55000,
                unit: "Piece",
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60",
                categoryId: electronicsCat._id,
                brandId: techGearBrand._id,
                vendorId: vendor._id,
                stock: "in_stock",
                stockQuantity: 500,
                minimumOrderQuantity: 10,
                b2bEnabled: true,
                b2bWholesalePrice: 42000,
                b2bMinOrderQty: 10,
                b2bBulkPricingSlabs: [
                    { minQty: 10, maxQty: 50, pricePerUnit: 42000 },
                    { minQty: 51, maxQty: 100, pricePerUnit: 40000 },
                    { minQty: 101, maxQty: null, pricePerUnit: 38000 }
                ],
                isActive: true
            },
            {
                name: "Ergonomic Office Chair",
                slug: "ergonomic-office-chair-b2b",
                description: "Comfortable ergonomic office chairs for modern workspaces.",
                price: 8500,
                originalPrice: 12000,
                unit: "Piece",
                image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60",
                categoryId: officeCat._id,
                brandId: officeProBrand._id,
                vendorId: vendor._id,
                stock: "in_stock",
                stockQuantity: 1000,
                minimumOrderQuantity: 5,
                b2bEnabled: true,
                b2bWholesalePrice: 7500,
                b2bMinOrderQty: 5,
                b2bBulkPricingSlabs: [
                    { minQty: 5, maxQty: 20, pricePerUnit: 7500 },
                    { minQty: 21, maxQty: 100, pricePerUnit: 6800 },
                    { minQty: 101, maxQty: null, pricePerUnit: 6000 }
                ],
                isActive: true
            },
            {
                name: "Corporate Welcome Kit (Premium)",
                slug: "corporate-welcome-kit",
                description: "Premium welcome kit containing diary, pen, flask, and mug. Fully customizable.",
                price: 1500,
                originalPrice: 2000,
                unit: "Set",
                image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&auto=format&fit=crop&q=60",
                categoryId: giftsCat._id,
                brandId: techGearBrand._id,
                vendorId: vendor._id,
                stock: "in_stock",
                stockQuantity: 2000,
                minimumOrderQuantity: 50,
                b2bEnabled: true,
                b2bWholesalePrice: 1200,
                b2bMinOrderQty: 50,
                b2bBulkPricingSlabs: [
                    { minQty: 50, maxQty: 200, pricePerUnit: 1200 },
                    { minQty: 201, maxQty: 500, pricePerUnit: 1000 },
                    { minQty: 501, maxQty: null, pricePerUnit: 850 }
                ],
                isActive: true
            },
            {
                name: "Executive Leather Briefcase",
                slug: "executive-leather-briefcase",
                description: "Premium leather briefcase for executives. Includes laptop compartment and organizers.",
                price: 4500,
                originalPrice: 6000,
                unit: "Piece",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
                categoryId: giftsCat._id,
                brandId: officeProBrand._id,
                vendorId: vendor._id,
                stock: "in_stock",
                stockQuantity: 500,
                minimumOrderQuantity: 10,
                b2bEnabled: true,
                b2bWholesalePrice: 3800,
                b2bMinOrderQty: 10,
                b2bBulkPricingSlabs: [
                    { minQty: 10, maxQty: 50, pricePerUnit: 3800 },
                    { minQty: 51, maxQty: 100, pricePerUnit: 3400 },
                    { minQty: 101, maxQty: null, pricePerUnit: 3000 }
                ],
                isActive: true
            },
            {
                name: "Bulk Wireless Mouse (Pack of 50)",
                slug: "bulk-wireless-mouse",
                description: "Reliable 2.4GHz wireless mouse for office use. Bulk packed.",
                price: 25000,
                originalPrice: 35000,
                unit: "Box",
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60",
                categoryId: electronicsCat._id,
                brandId: techGearBrand._id,
                vendorId: vendor._id,
                stock: "in_stock",
                stockQuantity: 100,
                minimumOrderQuantity: 1,
                b2bEnabled: true,
                b2bWholesalePrice: 22000,
                b2bMinOrderQty: 1,
                b2bBulkPricingSlabs: [
                    { minQty: 1, maxQty: 5, pricePerUnit: 22000 },
                    { minQty: 6, maxQty: 20, pricePerUnit: 20000 },
                    { minQty: 21, maxQty: null, pricePerUnit: 18000 }
                ],
                isActive: true
            }
        ];

        for (const pd of productsData) {
            let product = await Product.findOne({ slug: pd.slug });
            if (!product) {
                await Product.create(pd);
                console.log(`Created Product: ${pd.name}`);
            } else {
                // Update existing product with b2b settings
                await Product.updateOne({ slug: pd.slug }, { $set: pd });
                console.log(`Updated Product: ${pd.name}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
