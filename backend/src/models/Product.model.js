import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, index: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number },
        unit: { type: String, default: 'Piece' },
        images: [{ type: String }],
        image: { type: String }, // primary image
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
        brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
        stock: {
            type: String,
            enum: ['in_stock', 'low_stock', 'out_of_stock'],
            default: 'in_stock',
            index: true,
        },
        stockQuantity: { type: Number, default: 0, min: 0 },
        totalAllowedQuantity: { type: Number, min: 0 },
        minimumOrderQuantity: { type: Number, min: 1, default: 1 },
        lowStockThreshold: { type: Number, default: 10 },
        variants: {
            sizes: [String],
            colors: [String],
            materials: [String],
            attributes: [{
                name: String,
                values: [String],
            }],
            prices: { type: Map, of: Number },
            stockMap: { type: Map, of: Number },
            imageMap: { type: Map, of: String },
            defaultVariant: {
                size: String,
                color: String,
            },
            defaultSelection: {
                type: Map,
                of: String,
            },
        },
        flashSale: { type: Boolean, default: false, index: true },
        isNewArrival: { type: Boolean, default: false, index: true },
        isFeatured: { type: Boolean, default: false, index: true },
        isActive: { type: Boolean, default: true, index: true },
        isVisible: { type: Boolean, default: true },
        codAllowed: { type: Boolean, default: true },
        returnable: { type: Boolean, default: true },
        cancelable: { type: Boolean, default: true },
        taxIncluded: { type: Boolean, default: false },
        warrantyPeriod: { type: String },
        guaranteePeriod: { type: String },
        hsnCode: { type: String },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
        taxRate: { type: Number, default: 18 },
        b2bEnabled: { type: Boolean, default: false },
        b2bWholesalePrice: { type: Number },
        b2bMinOrderQty: { type: Number, default: 1 },
        b2bBulkPricingSlabs: [{
            minQty: Number,
            maxQty: Number,
            pricePerUnit: Number
        }],
        isRefurbished: { type: Boolean, default: false },
        refurbishedDetails: {
            condition: { type: String, enum: ['refurbished', 'renewed', 'open_box'] },
            grade: { type: String, enum: ['A', 'B', 'C'] },
            usageAge: { type: String },
            purchaseYear: { type: Number },
            batteryHealth: { type: Number },
            cosmeticCondition: { type: String },
            functionalCondition: { type: String },
            replacedParts: { type: String },
            repairDetails: { type: String },
            warrantyDuration: { type: String },
            warrantyType: { type: String },
            accessories: [{ type: String }],
            tested: { type: Boolean, default: false },
            certified: { type: Boolean, default: false },
            qualityChecked: { type: Boolean, default: false },
            flagged: { type: Boolean, default: false },
            flagReason: { type: String },
            approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
            rejectionReason: { type: String },
        },
        seoTitle: { type: String },
        seoDescription: { type: String },
        relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        faqs: [{ question: String, answer: String }],
        tags: [String],
    },
    { timestamps: true }
);

productSchema.index({ vendorId: 1, isActive: 1 });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export { Product };
export default Product;
