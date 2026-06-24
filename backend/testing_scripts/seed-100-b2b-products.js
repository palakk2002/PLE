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
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80' },
    { name: 'Office Supplies', slug: 'office-supplies', image: 'https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?w=500&q=80' },
    { name: 'Corporate Gifts', slug: 'corporate-gifts', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80' },
    { name: 'Office Furniture', slug: 'office-furniture', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
    { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
    { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
    { name: 'Jewelry', slug: 'jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80' },
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
    { name: 'Athletic', slug: 'athletic', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80' }
];

const generateProducts = (vendor, brands, categories) => {
    const products = [];

    const generateItemsForCategory = (catKey, itemsData, brandKey) => {
        itemsData.forEach((item, index) => {
            products.push(createB2BProduct(item, vendor, brands[brandKey], categories[catKey], index + 1));
        });
    };

    // 1. Electronics
    generateItemsForCategory('electronics', [
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
    ], 'tech');

    // 2. Office Furniture
    generateItemsForCategory('officefurniture', [
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
    ], 'office');

    // 3. Corporate Gifts
    generateItemsForCategory('corporategifts', [
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
    ], 'lifestyle');

    // 4. Office Supplies
    generateItemsForCategory('officesupplies', [
        { name: 'Premium Copy Paper (10 Ream Case)', price: 3000, image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80' },
        { name: 'Assorted Sticky Notes Bulk Pack', price: 800, image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80' },
        { name: 'Highlighter Pack (50 Assorted)', price: 1500, image: 'https://images.unsplash.com/photo-1522093537031-3ee39e6a98dc?w=500&q=80' },
        { name: 'Heavy Duty Stapler', price: 1200, image: 'https://images.unsplash.com/photo-1598103507300-47b2c0fb8d03?w=500&q=80' },
        { name: 'Ballpoint Pens Box (100 Blue)', price: 600, image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80' },
        { name: 'Dry Erase Markers (Pack of 24)', price: 1800, image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&q=80' },
        { name: 'Manila File Folders (Box of 100)', price: 900, image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&q=80' },
        { name: 'Paper Clips Bulk Jar', price: 400, image: 'https://images.unsplash.com/photo-1591852479261-26c71ab55a72?w=500&q=80' },
        { name: 'Whiteboard Presentation Set', price: 2500, image: 'https://images.unsplash.com/photo-1577563908411-50cb989766a3?w=500&q=80' },
        { name: 'Desk Organizer Mesh Set', price: 1500, image: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=500&q=80' }
    ], 'office');

    // 5. Clothing
    generateItemsForCategory('clothing', [
        { name: 'Corporate Branded Polo (Men)', price: 1500, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80' },
        { name: 'Corporate Branded Polo (Women)', price: 1500, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80' },
        { name: 'Custom Embroidered Fleece Jacket', price: 3500, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
        { name: 'Executive Dress Shirt', price: 2500, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80' },
        { name: 'Company Quarter-Zip Pullover', price: 2800, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80' },
        { name: 'Staff T-Shirts (Pack of 10)', price: 4000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
        { name: 'Formal Tailored Trousers', price: 3000, image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500&q=80' },
        { name: 'Company Logo Cap', price: 500, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80' },
        { name: 'High-Vis Safety Vest', price: 800, image: 'https://images.unsplash.com/photo-1584982751601-97d8b3400a45?w=500&q=80' },
        { name: 'Corporate Winter Scarf', price: 1200, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&q=80' }
    ], 'lifestyle');

    // 6. Footwear
    generateItemsForCategory('footwear', [
        { name: 'Executive Leather Oxfords', price: 5000, image: 'https://images.unsplash.com/photo-1614252339460-e1458e6e5843?w=500&q=80' },
        { name: 'Steel-Toe Safety Boots', price: 4500, image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80' },
        { name: 'Corporate Loafers (Men)', price: 4000, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80' },
        { name: 'Comfort Office Flats (Women)', price: 3000, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80' },
        { name: 'Anti-Slip Work Shoes', price: 3500, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' },
        { name: 'Breathable Uniform Sneakers', price: 2800, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
        { name: 'Industrial Rubber Gumboots', price: 2000, image: 'https://images.unsplash.com/photo-1518388836541-0f74ef99ceee?w=500&q=80' },
        { name: 'Casual Friday Boat Shoes', price: 3200, image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=500&q=80' },
        { name: 'Kitchen Service Clogs', price: 2500, image: 'https://images.unsplash.com/photo-1550001550-e88df0a7ed73?w=500&q=80' },
        { name: 'Premium Leather Ankle Boots', price: 6000, image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80' }
    ], 'lifestyle');

    // 7. Bags
    generateItemsForCategory('bags', [
        { name: 'Waterproof Laptop Backpack', price: 3500, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
        { name: 'Premium Leather Briefcase', price: 8000, image: 'https://images.unsplash.com/photo-1559523182-a284c3fb7cff?w=500&q=80' },
        { name: 'Corporate Canvas Tote', price: 800, image: 'https://images.unsplash.com/photo-1597633244018-7f55bdf3ebf3?w=500&q=80' },
        { name: 'Travel Duffle Bag', price: 4500, image: 'https://images.unsplash.com/photo-1550850839-8dc894ed385a?w=500&q=80' },
        { name: 'Tech Organizer Pouch', price: 1200, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80' },
        { name: 'Hard Shell Rolling Suitcase', price: 9000, image: 'https://images.unsplash.com/photo-1565026057447-bc90829ce0ae?w=500&q=80' },
        { name: 'Messenger Satchel Bag', price: 4000, image: 'https://images.unsplash.com/photo-1628149462102-7fb2a9fbc7bd?w=500&q=80' },
        { name: 'Drawstring Gym Bag (Pack of 50)', price: 15000, image: 'https://images.unsplash.com/photo-1550850839-8dc894ed385a?w=500&q=80' },
        { name: 'Insulated Lunch Cooler Tote', price: 1500, image: 'https://images.unsplash.com/photo-1601633534575-b6d3dc3f3ffc?w=500&q=80' },
        { name: 'Document Portfolio Case', price: 2500, image: 'https://images.unsplash.com/photo-1553556096-724bc2f19985?w=500&q=80' }
    ], 'lifestyle');

    // 8. Jewelry
    generateItemsForCategory('jewelry', [
        { name: 'Corporate Anniversary Watch', price: 15000, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80' },
        { name: 'Silver Cufflinks (Engravable)', price: 3000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
        { name: 'Gold-Plated Tie Clip', price: 1500, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80' },
        { name: 'Minimalist Silver Necklace', price: 4500, image: 'https://images.unsplash.com/photo-1599643478524-fb524458fcc6?w=500&q=80' },
        { name: 'Long Service Lapel Pin', price: 800, image: 'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=500&q=80' },
        { name: 'Premium Brooch', price: 2500, image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500&q=80' },
        { name: 'Leather Wrap Bracelet', price: 1200, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80' },
        { name: 'Diamond Accent Studs', price: 12000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
        { name: 'Smart Ring Wearable', price: 25000, image: 'https://images.unsplash.com/photo-1620612668581-2c069279a022?w=500&q=80' },
        { name: 'Stainless Steel Money Clip', price: 1000, image: 'https://images.unsplash.com/photo-1599643478524-fb524458fcc6?w=500&q=80' }
    ], 'lifestyle');

    // 9. Accessories
    generateItemsForCategory('accessories', [
        { name: 'Silk Corporate Tie', price: 1800, image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500&q=80' },
        { name: 'Leather Reversible Belt', price: 2500, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80' },
        { name: 'Blue Light Blocking Glasses', price: 1500, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
        { name: 'UV Protection Sunglasses', price: 3000, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
        { name: 'Cashmere Winter Gloves', price: 2200, image: 'https://images.unsplash.com/photo-1541094033282-53a5585ee5ce?w=500&q=80' },
        { name: 'Genuine Leather Wallet', price: 2800, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80' },
        { name: 'Corporate Umbrella (Windproof)', price: 1500, image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=500&q=80' },
        { name: 'RFID Blocking Card Holder', price: 1200, image: 'https://images.unsplash.com/photo-1558226065-3c137452d3a3?w=500&q=80' },
        { name: 'Premium Key Organizer', price: 900, image: 'https://images.unsplash.com/photo-1516089871146-24ddb5fc20ed?w=500&q=80' },
        { name: 'Woven Lanyard (Pack of 100)', price: 5000, image: 'https://images.unsplash.com/photo-1601633534575-b6d3dc3f3ffc?w=500&q=80' }
    ], 'lifestyle');

    // 10. Athletic
    generateItemsForCategory('athletic', [
        { name: 'Corporate Team Jersey', price: 1500, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80' },
        { name: 'Performance Running Shoes', price: 6000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
        { name: 'Moisture Wicking Gym Towel', price: 600, image: 'https://images.unsplash.com/photo-1584852932974-9f4a1329c20a?w=500&q=80' },
        { name: 'Yoga Mat with Alignment Lines', price: 1800, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80' },
        { name: 'Smart Fitness Tracker', price: 4500, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=500&q=80' },
        { name: 'Stainless Steel Protein Shaker', price: 1200, image: 'https://images.unsplash.com/photo-1585408992150-10a4db06c9f3?w=500&q=80' },
        { name: 'Compression Recovery Socks', price: 800, image: 'https://images.unsplash.com/photo-1604164448130-d1df213c64eb?w=500&q=80' },
        { name: 'Adjustable Dumbbell Set', price: 15000, image: 'https://images.unsplash.com/photo-1586401700818-10023a1038c3?w=500&q=80' },
        { name: 'Resistance Band Pack', price: 1000, image: 'https://images.unsplash.com/photo-1598266663412-7bb396825700?w=500&q=80' },
        { name: 'Foam Roller (High Density)', price: 1500, image: 'https://images.unsplash.com/photo-1515940175183-ee05a539207e?w=500&q=80' }
    ], 'lifestyle');

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

const seed100BulkProducts = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appzeto';
        console.log('Connecting to MongoDB...', uri.replace(/:([^:@]{3,})@/, ':***@'));
        await mongoose.connect(uri);
        console.log('Connected to MongoDB.');

        // 1. Get Vendor
        let vendor = await Vendor.findOne({ email: 'wholesale@techgear.com' });
        if (!vendor) vendor = await Vendor.findOne();
        if (!vendor) {
            console.error("No vendor found in the database. Please run seed-b2b-products.js first.");
            return;
        }

        // 2. Ensure all 10 Categories
        const categoryMap = {};
        for (const cat of B2B_CATEGORIES) {
            const doc = await Category.findOneAndUpdate(
                { slug: cat.slug },
                { name: cat.name, slug: cat.slug, image: cat.image, isActive: true },
                { upsert: true, new: true }
            );
            categoryMap[cat.slug.replace('-', '')] = doc;
        }
        console.log('Categories ensured.');

        // 3. Ensure Brands
        const techBrand = await Brand.findOneAndUpdate(
            { slug: 'tech-gear-pro' },
            { name: 'Tech Gear Pro', slug: 'tech-gear-pro', isActive: true },
            { upsert: true, new: true }
        );
        const officeBrand = await Brand.findOneAndUpdate(
            { slug: 'office-pro-plus' },
            { name: 'Office Pro Plus', slug: 'office-pro-plus', isActive: true },
            { upsert: true, new: true }
        );
        const lifestyleBrand = await Brand.findOneAndUpdate(
            { slug: 'lifestyle-essentials' },
            { name: 'Lifestyle Essentials', slug: 'lifestyle-essentials', isActive: true },
            { upsert: true, new: true }
        );
        console.log('Brands ensured.');

        // 4. Generate Products Data
        const productsData = generateProducts(
            vendor, 
            { tech: techBrand, office: officeBrand, lifestyle: lifestyleBrand }, 
            categoryMap
        );

        // 5. Insert 100 Products
        for (const pd of productsData) {
            await Product.findOneAndUpdate(
                { slug: pd.slug },
                pd,
                { upsert: true, new: true }
            );
        }

        console.log(`Successfully seeded ${productsData.length} B2B products across 10 categories!`);

    } catch (error) {
        console.error('Seeding Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seed100BulkProducts();
