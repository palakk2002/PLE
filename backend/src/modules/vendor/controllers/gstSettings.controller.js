import { Product } from '../../../models/Product.model.js';
import { Category } from '../../../models/Category.model.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * @desc Get vendor GST settings overview & categories stats
 * @route GET /api/vendor/gst-settings
 */
export const getVendorGstSettings = asyncHandler(async (req, res) => {
  const vendorId = req.user.id;

  // Get total count of products for this vendor
  const totalProducts = await Product.countDocuments({ vendorId });

  // Get count by gstMode
  const customGstCount = await Product.countDocuments({ vendorId, gstMode: 'custom' });
  const categoryGstCount = totalProducts - customGstCount;

  // Get category breakdown
  const categoryGroup = await Product.aggregate([
    { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: '$categoryId',
        count: { $sum: 1 },
        customGstCount: {
          $sum: { $cond: [{ $eq: ['$gstMode', 'custom'] }, 1, 0] },
        },
      },
    },
  ]);

  const categoryIds = categoryGroup.map((item) => item._id).filter(Boolean);
  const categories = await Category.find({ _id: { $in: categoryIds } }).select('name gstRate icon image');

  const categoryBreakdown = categoryGroup.map((item) => {
    const cat = categories.find((c) => String(c._id) === String(item._id));
    return {
      categoryId: item._id,
      categoryName: cat ? cat.name : 'Uncategorized',
      categoryGstRate: cat?.gstRate !== undefined ? cat.gstRate : 18,
      totalProducts: item.count,
      customGstCount: item.customGstCount,
      categoryGstCount: item.count - item.customGstCount,
    };
  });

  // Get list of all products for product-wise manager
  const products = await Product.find({ vendorId })
    .select('name image price gstMode gstRate categoryId brandId stockQuantity isVisible')
    .populate('categoryId', 'name gstRate')
    .sort({ updatedAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProducts,
        customGstCount,
        categoryGstCount,
        categoryBreakdown,
        products: products.map((p) => ({
          _id: p._id,
          name: p.name,
          image: p.image,
          price: p.price,
          gstMode: p.gstMode || 'category',
          gstRate: p.gstRate !== undefined ? p.gstRate : (p.categoryId?.gstRate ?? 18),
          categoryName: p.categoryId?.name || 'Uncategorized',
          categoryDefaultRate: p.categoryId?.gstRate ?? 18,
          isVisible: p.isVisible,
        })),
      },
      'Vendor GST settings fetched successfully'
    )
  );
});

/**
 * @desc Bulk update global GST rate for all vendor products or set global mode
 * @route POST /api/vendor/gst-settings/global
 */
export const updateGlobalGst = asyncHandler(async (req, res) => {
  const vendorId = req.user.id;
  const { gstRate, applyToAll } = req.body;

  if (gstRate === undefined || isNaN(gstRate) || gstRate < 0 || gstRate > 100) {
    throw new ApiError(400, 'Valid GST Rate (0-100%) is required');
  }

  const rate = Number(gstRate);

  // If applyToAll is true, set all vendor products to custom mode with specified gstRate
  if (applyToAll) {
    const result = await Product.updateMany(
      { vendorId },
      { $set: { gstMode: 'custom', gstRate: rate, taxRate: rate } }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { modifiedCount: result.modifiedCount },
          `Successfully applied ${rate}% GST rate to all ${result.modifiedCount} products`
        )
      );
  } else {
    // Revert all products to category mode
    const result = await Product.updateMany(
      { vendorId },
      { $set: { gstMode: 'category' } }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { modifiedCount: result.modifiedCount },
          `Successfully reset all products to Category-default GST mode`
        )
      );
  }
});

/**
 * @desc Bulk update GST rate for products under a specific category for vendor
 * @route POST /api/vendor/gst-settings/category
 */
export const updateCategoryGst = asyncHandler(async (req, res) => {
  const vendorId = req.user.id;
  const { categoryId, gstRate, gstMode = 'custom' } = req.body;

  if (!categoryId) {
    throw new ApiError(400, 'Category ID is required');
  }

  if (gstMode === 'custom') {
    if (gstRate === undefined || isNaN(gstRate) || gstRate < 0 || gstRate > 100) {
      throw new ApiError(400, 'Valid GST Rate (0-100%) is required');
    }
    const rate = Number(gstRate);
    const result = await Product.updateMany(
      { vendorId, categoryId },
      { $set: { gstMode: 'custom', gstRate: rate, taxRate: rate } }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { modifiedCount: result.modifiedCount },
          `Successfully set ${rate}% GST for ${result.modifiedCount} products in this category`
        )
      );
  } else {
    // Reset products in this category to use category default
    const result = await Product.updateMany(
      { vendorId, categoryId },
      { $set: { gstMode: 'category' } }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { modifiedCount: result.modifiedCount },
          `Successfully reset products in category to Category-default GST mode`
        )
      );
  }
});

/**
 * @desc Quick update gstMode & gstRate for a single product or batch
 * @route PATCH /api/vendor/gst-settings/product
 */
export const quickUpdateProductGst = asyncHandler(async (req, res) => {
  const vendorId = req.user.id;
  const { productId, productIds, gstMode, gstRate } = req.body;

  const targetIds = productIds || (productId ? [productId] : []);

  if (!targetIds || targetIds.length === 0) {
    throw new ApiError(400, 'At least one Product ID is required');
  }

  const updateFields = {};
  if (gstMode && ['category', 'custom'].includes(gstMode)) {
    updateFields.gstMode = gstMode;
  }

  if (gstRate !== undefined && !isNaN(gstRate)) {
    const rate = Number(gstRate);
    updateFields.gstRate = rate;
    updateFields.taxRate = rate;
  }

  const result = await Product.updateMany(
    { _id: { $in: targetIds }, vendorId },
    { $set: updateFields }
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { modifiedCount: result.modifiedCount },
      `Updated GST settings for ${result.modifiedCount} product(s)`
    )
  );
});
