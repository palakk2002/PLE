import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import Product from '../../../models/Product.model.js';
import Order from '../../../models/Order.model.js';
import ReturnRequest from '../../../models/ReturnRequest.model.js';

// @desc    Get all refurbished products for approval
// @route   GET /api/admin/refurbished-products
// @access  Private/Admin
export const getRefurbishedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isRefurbished: true })
        .populate('vendorId', 'name storeName')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, products, 'Refurbished products fetched successfully.'));
});

// @desc    Approve or reject a refurbished product
// @route   PUT /api/admin/refurbished-products/:id/status
// @access  Private/Admin
export const updateRefurbishedStatus = asyncHandler(async (req, res) => {
    const { status, grade, flagged, flagReason, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        throw new ApiError(400, 'Invalid status.');
    }

    const product = await Product.findById(req.params.id);

    if (!product || !product.isRefurbished) {
        throw new ApiError(404, 'Refurbished product not found.');
    }

    product.refurbishedDetails.approvalStatus = status;
    if (grade) product.refurbishedDetails.grade = grade;
    if (flagged !== undefined) product.refurbishedDetails.flagged = flagged;
    if (flagReason) product.refurbishedDetails.flagReason = flagReason;
    if (rejectionReason) product.refurbishedDetails.rejectionReason = rejectionReason;

    // If approved, make it visible/active in store
    if (status === 'approved') {
        product.isActive = true;
        product.isVisible = true;
    } else {
        // Pending or rejected means not visible in the main store
        product.isActive = false;
        product.isVisible = false;
    }

    await product.save();

    res.status(200).json(new ApiResponse(200, product, `Refurbished product ${status}.`));
});

// @desc    Get refurbished dashboard stats
// @route   GET /api/admin/refurbished-stats
// @access  Private/Admin
export const getRefurbishedStats = asyncHandler(async (req, res) => {
    const products = await Product.find({ isRefurbished: true }).lean();

    const productIds = products.map(p => p._id.toString());

    const stats = {
        totalListings: products.length,
        approved: products.filter(p => p.refurbishedDetails?.approvalStatus === 'approved').length,
        pendingApproval: products.filter(p => p.refurbishedDetails?.approvalStatus === 'pending').length,
        rejected: products.filter(p => p.refurbishedDetails?.approvalStatus === 'rejected').length,
    };

    // Calculate advanced metrics
    const orders = await Order.find({ 'items.productId': { $in: productIds } })
        .populate('items.productId')
        .lean();
    
    let totalSales = 0;
    let totalRevenue = 0;

    const vendorStats = {};
    const conditionSales = {};

    // For monthly revenue trend (last 5 months)
    const monthlyRevenue = Array(5).fill(0);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        // Calculate month difference (0 = current month, 1 = last month, up to 4)
        const monthDiff = (currentDate.getFullYear() - orderDate.getFullYear()) * 12 + (currentMonth - orderDate.getMonth());

        order.items.forEach(item => {
            if (item.productId && productIds.includes(item.productId._id?.toString() || item.productId.toString())) {
                const qty = item.quantity || 1;
                const rev = (item.price || 0) * qty;
                totalSales += qty;
                totalRevenue += rev;

                // Month bucket
                if (monthDiff >= 0 && monthDiff < 5) {
                    monthlyRevenue[4 - monthDiff] += rev; // index 4 is current month
                }

                // Vendor aggregation
                const p = products.find(prod => prod._id.toString() === (item.productId._id?.toString() || item.productId.toString()));
                if (p && p.vendorId) {
                    const vId = p.vendorId.toString();
                    if (!vendorStats[vId]) {
                        vendorStats[vId] = { sales: 0, revenue: 0, ratingSum: 0, ratingCount: 0 };
                    }
                    vendorStats[vId].sales += qty;
                    vendorStats[vId].revenue += rev;
                    // Mock ratings for now
                    vendorStats[vId].ratingSum += (p.rating || 4.5);
                    vendorStats[vId].ratingCount += 1;
                }

                // Condition aggregation
                if (p && p.refurbishedDetails) {
                    let cond = p.refurbishedDetails.condition || 'refurbished';
                    if (cond === 'refurbished') {
                        cond = `Grade ${p.refurbishedDetails.grade || 'A'} Refurbished`;
                    } else if (cond === 'renewed') {
                        cond = 'Renewed (Excellent)';
                    } else if (cond === 'open_box') {
                        cond = 'Open Box (Pristine)';
                    }

                    if (!conditionSales[cond]) conditionSales[cond] = { sales: 0, returns: 0 };
                    conditionSales[cond].sales += qty;
                }
            }
        });
    });

    const returnsList = await ReturnRequest.find({ isRefurbishedComplaint: true }).populate('productId').lean();
    
    returnsList.forEach(r => {
        if (r.productId && r.productId.refurbishedDetails) {
            let cond = r.productId.refurbishedDetails.condition || 'refurbished';
            if (cond === 'refurbished') {
                cond = `Grade ${r.productId.refurbishedDetails.grade || 'A'} Refurbished`;
            } else if (cond === 'renewed') {
                cond = 'Renewed (Excellent)';
            } else if (cond === 'open_box') {
                cond = 'Open Box (Pristine)';
            }
            if (!conditionSales[cond]) conditionSales[cond] = { sales: 0, returns: 0 };
            conditionSales[cond].returns += 1;
        }
    });

    const returnRatio = totalSales > 0 ? ((returnsList.length / totalSales) * 100).toFixed(1) : "0.0";

    // Format top sellers
    let topSellers = [];
    for (const vId of Object.keys(vendorStats)) {
        // Find vendor name
        const p = products.find(prod => prod.vendorId?.toString() === vId);
        const name = p?.vendorId?.storeName || p?.vendorId?.name || "Vendor";
        const rating = vendorStats[vId].ratingCount > 0 ? (vendorStats[vId].ratingSum / vendorStats[vId].ratingCount).toFixed(1) : "4.5";
        let badge = "Quality Checked";
        if (vendorStats[vId].sales > 50) badge = "Gold Certified";
        else if (vendorStats[vId].sales > 20) badge = "Verified Refurbisher";

        topSellers.push({
            name,
            sales: vendorStats[vId].sales,
            rating: parseFloat(rating),
            revenue: `₹${vendorStats[vId].revenue.toLocaleString()}`,
            badge
        });
    }
    topSellers = topSellers.sort((a, b) => b.sales - a.sales).slice(0, 5);

    // Format return stats
    const returnStats = Object.keys(conditionSales).map(cond => {
        const sales = conditionSales[cond].sales;
        const rets = conditionSales[cond].returns;
        const rate = sales > 0 ? ((rets / sales) * 100).toFixed(1) : "0.0";
        return {
            condition: cond,
            returnRate: `${rate}%`,
            volume: `${sales} units`
        };
    });

    const advancedStats = {
        sales: totalSales,
        salesChange: "+5.2% MoM",
        revenue: totalRevenue,
        revenueChange: "+8.4% MoM",
        returnRatio: returnRatio,
        topSellers,
        returnStats,
        monthlyRevenue
    };

    res.status(200).json(new ApiResponse(200, { ...stats, advanced: advancedStats }, 'Refurbished stats fetched successfully.'));
});
