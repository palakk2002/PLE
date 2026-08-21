import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import Product from '../../../models/Product.model.js';
import Category from '../../../models/Category.model.js';
import Brand from '../../../models/Brand.model.js';
import Vendor from '../../../models/Vendor.model.js';
import { slugify } from '../../../utils/slugify.js';

const checkB2BPermission = async (vendorId, salesChannel) => {
    if (salesChannel === 'B2B' || salesChannel === 'BOTH') {
        const vendor = await Vendor.findById(vendorId).select('b2bSellingStatus');
        if (!vendor || vendor.b2bSellingStatus !== 'approved') {
            throw new ApiError(
                403,
                'B2B selling is locked for your account. Please submit a B2B Seller Application with GST verification and get approval from the Administrator.'
            );
        }
    }
};

const deriveStockStatus = (stockQuantity = 0, lowStockThreshold = 10) => {
    if (stockQuantity <= 0) return 'out_of_stock';
    if (stockQuantity <= lowStockThreshold) return 'low_stock';
    return 'in_stock';
};

const sanitizeFaqs = (faqs) => {
    if (!Array.isArray(faqs)) return [];
    return faqs
        .map((faq) => ({
            question: String(faq?.question || '').trim(),
            answer: String(faq?.answer || '').trim(),
        }))
        .filter((faq) => faq.question && faq.answer);
};

const normalizeVariantPart = (value) => String(value || '').trim().toLowerCase();

const uniqueAxisValues = (values = []) => {
    const seen = new Set();
    const out = [];
    for (const raw of values) {
        const value = String(raw || '').trim();
        if (!value) continue;
        const key = normalizeVariantPart(value);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(value);
    }
    return out;
};

const createVariantKey = (size = '', color = '') =>
    `${normalizeVariantPart(size)}|${normalizeVariantPart(color)}`;
const normalizeAxisName = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
const createDynamicVariantKey = (selection = {}) =>
    Object.entries(selection || {})
        .map(([axis, value]) => [normalizeAxisName(axis), normalizeVariantPart(value)])
        .filter(([axis, value]) => axis && value)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([axis, value]) => `${axis}=${value}`)
        .join('|');

const toObjectEntries = (value) => {
    if (!value) return [];
    if (value instanceof Map) return Array.from(value.entries());
    if (typeof value === 'object') return Object.entries(value);
    return [];
};

const toNonNegativeNumber = (raw) => {
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const normalizeAttributes = (rawAttributes = []) => {
    const seen = new Set();
    const attributes = [];
    for (const raw of rawAttributes || []) {
        const name = String(raw?.name || '').trim();
        const axisKey = normalizeAxisName(name);
        if (!name || !axisKey || seen.has(axisKey)) continue;
        seen.add(axisKey);
        const values = uniqueAxisValues(raw?.values || []);
        if (!values.length) continue;
        attributes.push({ name, axisKey, values });
    }
    return attributes;
};

const buildCombinationsFromAttributes = (attributes = []) => {
    if (!attributes.length) return [];
    let combos = [{}];
    attributes.forEach((attr) => {
        const next = [];
        combos.forEach((selection) => {
            attr.values.forEach((value) => next.push({ ...selection, [attr.axisKey]: value }));
        });
        combos = next;
    });
    return combos;
};

const normalizeVariantsPayload = (rawVariants = {}, fallbackPrice) => {
    if (!rawVariants || typeof rawVariants !== 'object') {
        return { sizes: [], colors: [], attributes: [], prices: {}, stockMap: {}, imageMap: {}, defaultVariant: {}, defaultSelection: {} };
    }

    const sizes = uniqueAxisValues(rawVariants.sizes || []);
    const colors = uniqueAxisValues(rawVariants.colors || []);
    const attributes = normalizeAttributes(rawVariants.attributes || []);
    const hasSizeAxis = sizes.length > 0;
    const hasColorAxis = colors.length > 0;
    const hasDynamicAxes = attributes.length > 0;
    const hasAnyAxis = hasDynamicAxes || hasSizeAxis || hasColorAxis;

    if (!hasAnyAxis) {
        return { sizes: [], colors: [], attributes: [], prices: {}, stockMap: {}, imageMap: {}, defaultVariant: {}, defaultSelection: {} };
    }

    const combinations = [];
    if (hasDynamicAxes) {
        buildCombinationsFromAttributes(attributes).forEach((selection) => combinations.push({ selection }));
    } else if (hasSizeAxis && hasColorAxis) {
        sizes.forEach((size) => colors.forEach((color) => combinations.push({ selection: { size, color } })));
    } else if (hasSizeAxis) {
        sizes.forEach((size) => combinations.push({ selection: { size } }));
    } else {
        colors.forEach((color) => combinations.push({ selection: { color } }));
    }

    const pricesSource = Object.fromEntries(toObjectEntries(rawVariants.prices));
    const stockSource = Object.fromEntries(toObjectEntries(rawVariants.stockMap));
    const imageSource = Object.fromEntries(toObjectEntries(rawVariants.imageMap));
    const prices = {};
    const stockMap = {};
    const imageMap = {};

    combinations.forEach(({ selection }) => {
        const size = String(selection?.size || '');
        const color = String(selection?.color || '');
        const key = hasDynamicAxes
            ? createDynamicVariantKey(selection)
            : createVariantKey(size, color);
        const rawPrice = pricesSource[key];
        const parsedPrice = Number(rawPrice);
        if (Number.isFinite(parsedPrice) && parsedPrice >= 0) {
            prices[key] = parsedPrice;
        } else {
            const fallback = Number(fallbackPrice);
            if (Number.isFinite(fallback) && fallback >= 0) {
                prices[key] = fallback;
            }
        }

        const parsedStock = toNonNegativeNumber(stockSource[key]);
        if (parsedStock !== null) {
            stockMap[key] = parsedStock;
        }

        const image = String(imageSource[key] || '').trim();
        if (image) {
            imageMap[key] = image;
        }
    });

    const defaultSize = String(rawVariants?.defaultVariant?.size || '').trim();
    const defaultColor = String(rawVariants?.defaultVariant?.color || '').trim();
    const normalizedDefaultSize = hasSizeAxis ? defaultSize : '';
    const normalizedDefaultColor = hasColorAxis ? defaultColor : '';
    const hasValidDefaultSize = !normalizedDefaultSize || sizes.some((s) => normalizeVariantPart(s) === normalizeVariantPart(normalizedDefaultSize));
    const hasValidDefaultColor = !normalizedDefaultColor || colors.some((c) => normalizeVariantPart(c) === normalizeVariantPart(normalizedDefaultColor));

    if (!hasValidDefaultSize || !hasValidDefaultColor) {
        throw new ApiError(400, 'Default variant must exist in provided sizes/colors.');
    }

    const defaultSelection = {};
    if (rawVariants?.defaultSelection && typeof rawVariants.defaultSelection === 'object') {
        Object.entries(rawVariants.defaultSelection).forEach(([axis, value]) => {
            const axisKey = normalizeAxisName(axis);
            const selectedValue = String(value || '').trim();
            if (!axisKey || !selectedValue) return;
            const axisMeta = attributes.find((attr) => attr.axisKey === axisKey);
            if (!axisMeta) return;
            const matched = axisMeta.values.find(
                (candidate) => normalizeVariantPart(candidate) === normalizeVariantPart(selectedValue)
            );
            if (matched) defaultSelection[axisKey] = matched;
        });
    }

    return {
        sizes,
        colors,
        attributes: attributes.map((attr) => ({ name: attr.name, values: attr.values })),
        prices,
        stockMap,
        imageMap,
        defaultVariant: {
            size: normalizedDefaultSize,
            color: normalizedDefaultColor,
        },
        defaultSelection,
    };
};

const calculateVariantAggregateStock = (variants = {}) => {
    const entries = toObjectEntries(variants.stockMap);
    if (!entries.length) return null;
    return entries.reduce((sum, [, value]) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed >= 0 ? sum + parsed : sum;
    }, 0);
};

// GET /api/vendor/products
export const getVendorProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search, stock, salesChannel, approvalStatus } = req.query;
    const numericPage = Math.max(1, Number(page) || 1);
    const numericLimit = Math.max(1, Number(limit) || 20);
    const skip = (numericPage - 1) * numericLimit;
    
    const filter = req.user.role === 'managed_vendor'
        ? { shopId: req.user.shopId }
        : { vendorId: req.user.id };

    if (search) filter.$text = { $search: search };
    if (stock) filter.stock = stock;
    if (salesChannel) filter.salesChannel = salesChannel;
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    const products = await Product.find(filter).populate('categoryId', 'name gstRate').populate('brandId', 'name').sort({ createdAt: -1 }).skip(skip).limit(numericLimit);
    const total = await Product.countDocuments(filter);
    res.status(200).json(new ApiResponse(200, { products, total, page: numericPage, pages: Math.ceil(total / numericLimit) }, 'Products fetched.'));
});

// GET /api/vendor/products/:id
export const getVendorProductById = asyncHandler(async (req, res) => {
    const query = req.user.role === 'managed_vendor'
        ? { _id: req.params.id, shopId: req.user.shopId }
        : { _id: req.params.id, vendorId: req.user.id };

    const product = await Product.findOne(query)
        .populate('categoryId', 'name parentId gstRate')
        .populate('brandId', 'name');
    if (!product) throw new ApiError(404, 'Product not found or access denied.');
    res.status(200).json(new ApiResponse(200, product, 'Product fetched.'));
});

// POST /api/vendor/products
export const createProduct = asyncHandler(async (req, res) => {
    const { name, ...rest } = req.body;
    if (!name) throw new ApiError(400, 'Product name is required.');
    const slug = slugify(name) + '-' + Date.now();
    const stockQuantity = Number(rest.stockQuantity ?? 0);
    const lowStockThreshold = Number(rest.lowStockThreshold ?? 10);
    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
        throw new ApiError(400, 'Invalid stock quantity.');
    }
    if (!Number.isFinite(lowStockThreshold) || lowStockThreshold < 0) {
        throw new ApiError(400, 'Invalid low stock threshold.');
    }
    const price = Number(rest.price);
    if (!Number.isFinite(price) || price < 0) {
        throw new ApiError(400, 'Invalid product price.');
    }
    const normalizedVariants = normalizeVariantsPayload(rest.variants, price);
    const variantAggregateStock = calculateVariantAggregateStock(normalizedVariants);
    const finalStockQuantity = Number.isFinite(variantAggregateStock)
        ? variantAggregateStock
        : stockQuantity;
    const stock = deriveStockStatus(finalStockQuantity, lowStockThreshold);

    const isManaged = req.user.role === 'managed_vendor';
    const targetSalesChannel = isManaged ? 'B2C' : (rest.salesChannel || 'B2C');

    if (!isManaged) {
        await checkB2BPermission(req.user.id, targetSalesChannel);
    }

    const product = await Product.create({
        name,
        slug,
        vendorId: isManaged ? undefined : req.user.id,
        shopId: isManaged ? req.user.shopId : undefined,
        vendorUserId: isManaged ? req.user.id : undefined,
        createdBy: req.user.id,
        approvalStatus: isManaged ? 'pending' : 'approved',
        isActive: !isManaged,
        auditLog: [{
            action: 'created',
            userId: req.user.id,
            userType: isManaged ? 'managed_vendor' : 'vendor',
            timestamp: new Date(),
            reason: isManaged ? 'Product submitted for admin review' : 'Product created'
        }],
        ...rest,
        salesChannel: targetSalesChannel,
        price,
        variants: normalizedVariants,
        faqs: sanitizeFaqs(rest.faqs),
        stockQuantity: finalStockQuantity,
        lowStockThreshold,
        stock,
    });
    res.status(201).json(new ApiResponse(201, product, 'Product created.'));
});

// PUT /api/vendor/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
    const query = req.user.role === 'managed_vendor'
        ? { _id: req.params.id, shopId: req.user.shopId }
        : { _id: req.params.id, vendorId: req.user.id };

    const product = await Product.findOne(query);
    if (!product) throw new ApiError(404, 'Product not found or access denied.');

    if (req.user.role === 'managed_vendor') {
        if (!['pending', 'rejected'].includes(product.approvalStatus)) {
            throw new ApiError(403, 'You cannot edit approved or live products.');
        }
        // If product was rejected, editing resubmits it for review
        if (product.approvalStatus === 'rejected') {
            product.approvalStatus = 'pending';
        }
    } else {
        const incomingChannel = req.body.salesChannel || product.salesChannel;
        if (req.body.salesChannel && ['B2B', 'BOTH'].includes(req.body.salesChannel)) {
            await checkB2BPermission(req.user.id, req.body.salesChannel);
        }
    }

    Object.assign(product, req.body);
    if (Object.prototype.hasOwnProperty.call(req.body, 'faqs')) {
        product.faqs = sanitizeFaqs(req.body.faqs);
    }
    if (typeof req.body.stockQuantity !== 'undefined' || typeof req.body.lowStockThreshold !== 'undefined') {
        const stockQuantity = Number(product.stockQuantity ?? 0);
        const lowStockThreshold = Number(product.lowStockThreshold ?? 10);
        if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
            throw new ApiError(400, 'Invalid stock quantity.');
        }
        if (!Number.isFinite(lowStockThreshold) || lowStockThreshold < 0) {
            throw new ApiError(400, 'Invalid low stock threshold.');
        }
        product.stockQuantity = stockQuantity;
        product.lowStockThreshold = lowStockThreshold;
        product.stock = deriveStockStatus(stockQuantity, lowStockThreshold);
    }
    if (typeof req.body.price !== 'undefined') {
        const price = Number(req.body.price);
        if (!Number.isFinite(price) || price < 0) {
            throw new ApiError(400, 'Invalid product price.');
        }
        product.price = price;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'variants')) {
        product.variants = normalizeVariantsPayload(req.body.variants, product.price);
        const variantAggregateStock = calculateVariantAggregateStock(product.variants);
        if (Number.isFinite(variantAggregateStock)) {
            product.stockQuantity = variantAggregateStock;
        }
    }
    // Keep stock state deterministic from quantity + threshold.
    product.stock = deriveStockStatus(
        Number(product.stockQuantity ?? 0),
        Number(product.lowStockThreshold ?? 10)
    );

    // Audit log update
    product.updatedBy = req.user.id;
    product.auditLog.push({
        action: 'updated',
        userId: req.user.id,
        userType: req.user.role === 'managed_vendor' ? 'managed_vendor' : 'vendor',
        timestamp: new Date(),
        reason: 'Product details updated'
    });

    await product.save();
    res.status(200).json(new ApiResponse(200, product, 'Product updated.'));
});

// DELETE /api/vendor/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
    if (req.user.role === 'managed_vendor') {
        throw new ApiError(403, 'Managed vendors are not allowed to delete products.');
    }
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendorId: req.user.id });
    if (!product) throw new ApiError(404, 'Product not found or access denied.');
    res.status(200).json(new ApiResponse(200, null, 'Product deleted.'));
});

// PATCH /api/vendor/stock/:productId
export const updateStock = asyncHandler(async (req, res) => {
    const { stockQuantity } = req.body;
    const query = req.user.role === 'managed_vendor'
        ? { _id: req.params.productId, shopId: req.user.shopId }
        : { _id: req.params.productId, vendorId: req.user.id };

    const product = await Product.findOne(query);
    if (!product) throw new ApiError(404, 'Product not found.');

    const numericStockQuantity = Number(stockQuantity);
    if (
        !Number.isFinite(numericStockQuantity) ||
        numericStockQuantity < 0 ||
        !Number.isInteger(numericStockQuantity)
    ) {
        throw new ApiError(400, 'Invalid stock quantity.');
    }

    product.stockQuantity = numericStockQuantity;
    product.stock = deriveStockStatus(numericStockQuantity, product.lowStockThreshold);
    await product.save();

    res.status(200).json(new ApiResponse(200, product, 'Stock updated.'));
});

// POST /api/vendor/products/bulk
export const createBulkProducts = asyncHandler(async (req, res) => {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        throw new ApiError(400, 'Please provide an array of products to upload.');
    }

    if (products.length > 500) {
        throw new ApiError(400, 'Bulk product upload is limited to 500 products per batch.');
    }

    const isManaged = req.user.role === 'managed_vendor';
    let isB2BApproved = isManaged;
    if (!isManaged) {
        const vendorDoc = await Vendor.findById(req.user.id).select('b2bSellingStatus');
        isB2BApproved = vendorDoc?.b2bSellingStatus === 'approved';
    }

    const createdProducts = [];
    const errors = [];

    // Find default category if categoryId not specified
    let defaultCategory = await Category.findOne({ isActive: true });

    for (let index = 0; index < products.length; index++) {
        const item = products[index];
        const rowNum = index + 1;

        try {
            const name = String(item.name || '').trim();
            const price = Number(item.price);
            const stockQuantity = Math.max(0, Number(item.stockQuantity || item.stock || 0));

            if (!name) {
                throw new Error(`Row #${rowNum}: Missing product name.`);
            }
            if (!Number.isFinite(price) || price < 0) {
                throw new Error(`Row #${rowNum}: Invalid or missing product price.`);
            }

            let categoryId = item.categoryId;
            let subcategoryId = item.subcategoryId;
            let brandId = item.brandId;

            if (!categoryId && item.categoryName) {
                const catDoc = await Category.findOne({ name: new RegExp(`^${item.categoryName.trim()}$`, 'i') });
                if (catDoc) categoryId = catDoc._id;
            }
            if (!categoryId && defaultCategory) {
                categoryId = defaultCategory._id;
            }

            if (!categoryId) {
                throw new Error(`Row #${rowNum}: No valid category found for product ${name}.`);
            }

            if (!subcategoryId && item.subcategoryName) {
                const subCatDoc = await Category.findOne({
                    name: new RegExp(`^${item.subcategoryName.trim()}$`, 'i'),
                    parentId: categoryId
                });
                if (subCatDoc) subcategoryId = subCatDoc._id;
            }

            if (!brandId && item.brandName) {
                const brandDoc = await Brand.findOne({ name: new RegExp(`^${item.brandName.trim()}$`, 'i') });
                if (brandDoc) {
                    brandId = brandDoc._id;
                }
            }

            const targetSalesChannel = isManaged
                ? 'B2C'
                : (['B2C', 'B2B', 'BOTH'].includes(item.salesChannel) ? item.salesChannel : 'B2C');

            if (!isManaged && (targetSalesChannel === 'B2B' || targetSalesChannel === 'BOTH') && !isB2BApproved) {
                throw new Error(`Row #${rowNum}: B2B selling is locked for your account. Please apply for B2B selling approval with GST verification.`);
            }

            if (!isManaged && (targetSalesChannel === 'B2B' || targetSalesChannel === 'BOTH') && (!item.b2bWholesalePrice || isNaN(item.b2bWholesalePrice) || Number(item.b2bWholesalePrice) <= 0)) {
                throw new Error(`Row #${rowNum}: Missing or invalid B2B Wholesale Price for ${targetSalesChannel} product '${name}'.`);
            }

            let baseSlug = slugify(name);
            let slug = `${baseSlug}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

            const stock = deriveStockStatus(stockQuantity, Number(item.lowStockThreshold || 10));

            const parseBool = (val, defaultVal = true) => {
                if (val === undefined || val === null || val === '') return defaultVal;
                if (typeof val === 'boolean') return val;
                const str = String(val).trim().toLowerCase();
                if (['yes', 'true', '1'].includes(str)) return true;
                if (['no', 'false', '0'].includes(str)) return false;
                return defaultVal;
            };

            const productData = {
                name,
                slug,
                description: item.description || '',
                price,
                originalPrice: Number(item.originalPrice || price),
                unit: item.unit || 'Piece',
                categoryId,
                subcategoryId: subcategoryId || undefined,
                brandId: brandId || undefined,
                vendorId: isManaged ? undefined : req.user.id,
                shopId: isManaged ? req.user.shopId : undefined,
                vendorUserId: isManaged ? req.user.id : undefined,
                createdBy: req.user.id,
                approvalStatus: isManaged ? 'pending' : 'approved',
                isActive: !isManaged,
                stockQuantity,
                lowStockThreshold: Number(item.lowStockThreshold || 10),
                minimumOrderQuantity: item.minimumOrderQuantity ? Math.max(1, Number(item.minimumOrderQuantity)) : 1,
                totalAllowedQuantity: item.totalAllowedQuantity ? Math.max(1, Number(item.totalAllowedQuantity)) : undefined,
                warrantyPeriod: item.warrantyPeriod || '',
                guaranteePeriod: item.guaranteePeriod || '',
                hsnCode: item.hsnCode || '',
                stock,
                image: item.image || item.primaryImage || '',
                images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
                
                // Policies / Flags & GST
                codAllowed: parseBool(item.codAllowed, true),
                returnable: parseBool(item.returnable, true),
                cancelable: parseBool(item.cancelable, true),
                taxIncluded: parseBool(item.taxIncluded, false),
                gstMode: ['category', 'custom'].includes(String(item.gstMode || '').toLowerCase()) ? String(item.gstMode).toLowerCase() : 'category',
                gstRate: item.gstRate !== undefined && item.gstRate !== '' ? Number(item.gstRate) : (item.taxRate ? Number(item.taxRate) : 18),
                taxRate: item.gstRate !== undefined && item.gstRate !== '' ? Number(item.gstRate) : (item.taxRate ? Number(item.taxRate) : 18),

                // B2B Details
                salesChannel: targetSalesChannel,
                b2bWholesalePrice: !isManaged && item.b2bWholesalePrice ? Number(item.b2bWholesalePrice) : undefined,
                b2bMinOrderQty: !isManaged && item.b2bMinOrderQty ? Number(item.b2bMinOrderQty) : 1,
                b2bUnitsPerCarton: item.b2bUnitsPerCarton ? Number(item.b2bUnitsPerCarton) : undefined,
                b2bGstRate: item.b2bGstRate ? String(item.b2bGstRate) : '18',
                b2bPackagingType: item.b2bPackagingType || 'standard',
                b2bLeadTimeDays: item.b2bLeadTimeDays ? Number(item.b2bLeadTimeDays) : undefined,
                b2bCreditTerms: item.b2bCreditTerms || 'prepaid',

                // Refurbished / Condition details
                condition: item.condition || (parseBool(item.isRefurbished, false) ? 'refurbished' : 'brand_new'),
                refurbishedGrade: item.refurbishedGrade || undefined,
                productAgeMonths: item.productAgeMonths || item.usageAge || undefined,
                purchaseYear: item.purchaseYear ? Number(item.purchaseYear) : undefined,
                deviceHealthBattery: item.deviceHealthBattery ? Number(item.deviceHealthBattery) : undefined,
                deviceHealthCosmetic: item.deviceHealthCosmetic || undefined,
                deviceHealthFunctional: item.deviceHealthFunctional || undefined,
                repairHistory: item.repairHistory || item.refurbishedNotes || undefined,
                refurbishedWarrantyDuration: item.refurbishedWarrantyDuration || item.warrantyPeriod || undefined,
                accessoryCharger: parseBool(item.accessoryCharger, false),
                accessoryBox: parseBool(item.accessoryBox, false),
                isTested: parseBool(item.isTested, false),
                isCertified: parseBool(item.isCertified, false),

                auditLog: [{
                    action: 'created',
                    userId: req.user.id,
                    userType: isManaged ? 'managed_vendor' : 'vendor',
                    timestamp: new Date(),
                    reason: 'Bulk product created'
                }],
            };

            const createdDoc = await Product.create(productData);
            createdProducts.push({
                row: rowNum,
                id: createdDoc._id,
                name: createdDoc.name,
                price: createdDoc.price,
            });
        } catch (err) {
            errors.push({
                row: rowNum,
                message: err.message || `Error processing row #${rowNum}`,
            });
        }
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalAttempted: products.length,
                successCount: createdProducts.length,
                failedCount: errors.length,
                createdProducts,
                errors,
            },
            `Bulk product upload complete: ${createdProducts.length} created, ${errors.length} failed.`
        )
    );
});
