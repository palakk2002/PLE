import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import Vendor from '../../../models/Vendor.model.js';
import RFQ from '../../../models/RFQ.model.js';
import mongoose from 'mongoose';

// GET /api/v1/vendor/b2b/settings
export const getSettings = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.user.id).select('b2bSettings');
    if (!vendor) {
        throw new ApiError(404, 'Vendor not found.');
    }
    
    // Fallback default settings if none exist
    const defaultSettings = {
        autoResponse: false,
        autoResponseMessage: "Thank you for submitting a Request For Quotation. We will review your product requirement list and submit a custom wholesale quotation shortly.",
        defaultPaymentTerms: "Net 30 days",
        defaultShippingTerms: "FOB Origin",
        minimumOrderValue: 50000,
        defaultQuoteValidity: 15,
        notifyOnNewEnquiry: true,
        notifyOnQuoteResponse: true,
        notifyOnEnquiryExpiring: true
    };

    const settings = vendor.b2bSettings || defaultSettings;

    res.status(200).json(new ApiResponse(200, settings, 'B2B settings fetched successfully.'));
});

// PUT /api/v1/vendor/b2b/settings
export const updateSettings = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) {
        throw new ApiError(404, 'Vendor not found.');
    }

    vendor.b2bSettings = {
        ...vendor.b2bSettings,
        ...req.body
    };

    await vendor.save();

    res.status(200).json(new ApiResponse(200, vendor.b2bSettings, 'B2B settings updated successfully.'));
});

// GET /api/v1/vendor/b2b/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;

    // Fetch all RFQs where the vendor is assigned
    const rfqs = await RFQ.find({ assignedVendorIds: vendorId }).populate('productId', 'name');

    let newEnquiries = 0;
    let respondedEnquiries = 0;
    let quotedEnquiries = 0;
    let acceptedEnquiries = 0;
    let rejectedEnquiries = 0;
    let expiredEnquiries = 0;
    
    let totalQuoteValue = 0;
    let quoteCount = 0;
    let totalResponseTimeMs = 0;
    let respondedQuotesCount = 0;
    
    const monthlyTrendMap = new Map();
    const productMap = new Map();

    const now = new Date();

    rfqs.forEach(rfq => {
        // Evaluate vendor specific status
        const myQuote = rfq.quotations.find(q => String(q.vendorId) === String(vendorId));
        
        let mappedStatus = "new";
        if (myQuote) {
            if (myQuote.status === "Selected" || myQuote.status === "selected") {
                mappedStatus = "accepted";
                acceptedEnquiries++;
            } else if (myQuote.status === "Rejected" || myQuote.status === "rejected") {
                mappedStatus = "rejected";
                rejectedEnquiries++;
            } else {
                mappedStatus = "quoted";
                quotedEnquiries++;
            }
            
            // Calculate quote value
            if (myQuote.totalPrice) {
                totalQuoteValue += myQuote.totalPrice;
                quoteCount++;
            }

            // Estimate response time
            const rfqCreationTime = new Date(rfq.createdAt).getTime();
            const quoteCreationTime = new Date(myQuote.createdAt || myQuote.updatedAt || rfq.createdAt).getTime();
            if (quoteCreationTime > rfqCreationTime) {
                totalResponseTimeMs += (quoteCreationTime - rfqCreationTime);
                respondedQuotesCount++;
            }

        } else {
            if (rfq.status === "Rejected") {
                mappedStatus = "rejected";
                rejectedEnquiries++;
            } else if (['Completed', 'Purchase Order Generated', 'Vendor Selected'].includes(rfq.status)) {
                mappedStatus = "expired";
                expiredEnquiries++;
            } else {
                mappedStatus = "new";
                newEnquiries++;
            }
        }

        // Monthly Trend
        const rfqDate = new Date(rfq.createdAt);
        const monthName = rfqDate.toLocaleString('default', { month: 'short' });
        monthlyTrendMap.set(monthName, (monthlyTrendMap.get(monthName) || 0) + 1);

        // Top Products
        const prodName = rfq.productId?.name || rfq.customProductName || 'Unknown Product';
        const qty = rfq.quantity || 1;
        if (!productMap.has(prodName)) {
            productMap.set(prodName, { count: 0, totalQty: 0 });
        }
        const pData = productMap.get(prodName);
        pData.count += 1;
        pData.totalQty += qty;
    });

    const totalEnquiries = rfqs.length;
    const conversionRate = quotedEnquiries > 0 ? ((acceptedEnquiries / quotedEnquiries) * 100).toFixed(1) : 0;
    const avgQuoteValue = quoteCount > 0 ? totalQuoteValue / quoteCount : 0;
    
    // Average response time in hours
    const avgResponseTime = respondedQuotesCount > 0 
        ? (totalResponseTimeMs / respondedQuotesCount / (1000 * 60 * 60)).toFixed(1) 
        : 0;

    // Format Monthly Trend (Last 6 months approx)
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIdx = now.getMonth();
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
        let mIdx = currentMonthIdx - i;
        if (mIdx < 0) mIdx += 12;
        const mName = allMonths[mIdx];
        monthlyTrend.push({
            month: mName,
            count: monthlyTrendMap.get(mName) || 0
        });
    }

    // Format Top Products
    const topProductsByEnquiry = Array.from(productMap.entries())
        .map(([name, data]) => ({ name, count: data.count, totalQty: data.totalQty }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // top 5

    const analytics = {
        totalEnquiries,
        newEnquiries,
        respondedEnquiries: quotedEnquiries + acceptedEnquiries + rejectedEnquiries,
        quotedEnquiries,
        acceptedEnquiries,
        rejectedEnquiries,
        expiredEnquiries,
        totalQuoteValue,
        avgQuoteValue,
        conversionRate,
        avgResponseTime,
        monthlyTrend,
        topProductsByEnquiry
    };

    res.status(200).json(new ApiResponse(200, analytics, 'B2B analytics fetched successfully.'));
});
