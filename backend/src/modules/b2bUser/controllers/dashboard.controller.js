import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import B2BCompany from '../../../models/B2BCompany.model.js';
import User from '../../../models/User.model.js';
import { RFQ } from '../../../models/RFQ.model.js';
import { PurchaseOrder } from '../../../models/PurchaseOrder.model.js';

const getCompanyId = async (req) => {
    let companyId = req.user.companyId;
    if (!companyId) {
        const admin = await User.findById(req.user.id);
        if (admin) companyId = admin.companyId;
    }
    return companyId;
};

/**
 * @desc    Get dashboard overview stats for B2B Admin
 * @route   GET /api/b2b-user/admin/dashboard
 * @access  Private (B2B Admin)
 */
export const getDashboardOverview = asyncHandler(async (req, res) => {
    const companyId = await getCompanyId(req);

    const company = await B2BCompany.findById(companyId).select('companyName verificationStatus');
    if (!company) {
        return res.status(404).json(new ApiResponse(404, null, 'Company not found.'));
    }

    // Run all queries in parallel
    const [
        totalEmployees,
        activeEmployees,
        newEmployees,
        rfqs,
        purchaseOrders
    ] = await Promise.all([
        User.countDocuments({ companyId, role: 'b2bEmployee' }),
        User.countDocuments({ companyId, role: 'b2bEmployee', isActive: true }),
        User.countDocuments({
            companyId,
            role: 'b2bEmployee',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }),
        RFQ.find({ companyId }).sort({ createdAt: -1 }),
        PurchaseOrder.find({ companyId }).populate('rfqId').sort({ createdAt: -1 })
    ]);

    // ── RFQ Stats ─────────────────────────────────────────────
    const rfqStats = {
        total: rfqs.length,
        draft: rfqs.filter(r => r.status === 'Draft').length,
        submitted: rfqs.filter(r => ['Submitted', 'Under Review', 'Pending'].includes(r.status)).length,
        inProgress: rfqs.filter(r => ['Sent To Vendors', 'Quotations Received', 'Vendor Evaluation', 'Vendor Negotiation', 'Vendor Selected', 'Awaiting B2B Approval', 'Approved'].includes(r.status)).length,
        completed: rfqs.filter(r => ['Purchase Order Generated', 'Completed'].includes(r.status)).length,
        rejected: rfqs.filter(r => r.status === 'Rejected').length,
    };

    // ── Purchase Order Stats ───────────────────────────────────
    const totalSpend = purchaseOrders.reduce((sum, po) => sum + (po.pricing?.total || 0), 0);
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const thisMonthSpend = purchaseOrders
        .filter(po => new Date(po.createdAt) >= thisMonthStart)
        .reduce((sum, po) => sum + (po.pricing?.total || 0), 0);
    const thisMonthPOs = purchaseOrders.filter(po => new Date(po.createdAt) >= thisMonthStart).length;

    // ── Monthly RFQ Trend (last 6 months) ─────────────────────
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const rfqCounts = Array(12).fill(0);
    const spendByMonth = Array(12).fill(0);

    rfqs.forEach(r => {
        rfqCounts[new Date(r.createdAt).getMonth()]++;
    });
    purchaseOrders.forEach(po => {
        spendByMonth[new Date(po.createdAt).getMonth()] += (po.pricing?.total || 0);
    });

    const currentMonth = new Date().getMonth();
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonth - i + 12) % 12;
        monthlyTrend.push({
            name: months[mIdx],
            RFQs: rfqCounts[mIdx],
            Spend: Math.round(spendByMonth[mIdx])
        });
    }

    // ── Status Distribution ────────────────────────────────────
    const statusGroups = {};
    rfqs.forEach(r => {
        let g = r.status;
        if (['Submitted', 'Under Review', 'Pending'].includes(r.status)) g = 'Under Review';
        if (['Sent To Vendors', 'Quotations Received'].includes(r.status)) g = 'Vendor Bidding';
        if (['Vendor Evaluation', 'Vendor Negotiation'].includes(r.status)) g = 'Evaluation';
        if (['Vendor Selected', 'Awaiting B2B Approval', 'Approved'].includes(r.status)) g = 'Awaiting Approval';
        if (['Purchase Order Generated', 'Completed'].includes(r.status)) g = 'Completed';
        statusGroups[g] = (statusGroups[g] || 0) + 1;
    });
    const statusDistribution = Object.entries(statusGroups).map(([name, value]) => ({ name, value }));

    // ── Vendor Participation (bids per RFQ, top 6) ────────────
    const vendorParticipation = rfqs
        .filter(r => r.quotations?.length > 0)
        .slice(0, 6)
        .map(r => ({
            name: r.rfqId?.split('-').slice(-1)[0] || r.rfqId,
            Bids: r.quotations.length,
            product: r.customProductName || r.rfqId
        }))
        .reverse();

    // ── Recent RFQs (last 5) ───────────────────────────────────
    const recentRFQs = rfqs.slice(0, 5).map(r => ({
        _id: r._id,
        rfqId: r.rfqId,
        product: r.customProductName || 'Product',
        status: r.status,
        priority: r.priority,
        quantity: r.quantity,
        targetPrice: r.targetPrice,
        createdAt: r.createdAt
    }));

    // ── Recent POs (last 5) ────────────────────────────────────
    const recentPOs = purchaseOrders.slice(0, 5).map(po => ({
        _id: po._id,
        poNumber: po.poNumber,
        vendorName: po.vendorDetails?.storeName || po.vendorDetails?.name || 'Vendor',
        product: po.productDetails?.name || 'Product',
        total: po.pricing?.total || 0,
        status: po.status,
        createdAt: po.createdAt
    }));

    // ── Spend By Employee ─────────────────────────────────────
    const employeeSpendMap = {};
    const companyEmployees = await User.find({ companyId, role: 'b2bEmployee' }).select('name email');
    companyEmployees.forEach(emp => {
        employeeSpendMap[emp._id.toString()] = {
            id: emp._id.toString(),
            name: emp.name,
            email: emp.email,
            spend: 0
        };
    });

    purchaseOrders.forEach(po => {
        const rfq = po.rfqId;
        if (rfq && rfq.createdByEmployeeId) {
            const empId = rfq.createdByEmployeeId.toString();
            if (employeeSpendMap[empId]) {
                employeeSpendMap[empId].spend += (po.pricing?.total || 0);
            } else {
                employeeSpendMap[empId] = {
                    id: empId,
                    name: 'Unknown Employee',
                    spend: po.pricing?.total || 0
                };
            }
        }
    });

    const employeeSpending = Object.values(employeeSpendMap);

    const stats = {
        company: {
            name: company.companyName,
            verificationStatus: company.verificationStatus
        },
        employees: { total: totalEmployees, active: activeEmployees, newThisMonth: newEmployees },
        rfq: rfqStats,
        procurement: {
            totalPOs: purchaseOrders.length,
            totalSpend,
            thisMonthSpend,
            thisMonthPOs,
            avgPOValue: purchaseOrders.length > 0 ? Math.round(totalSpend / purchaseOrders.length) : 0
        },
        charts: {
            monthlyTrend,
            statusDistribution,
            vendorParticipation,
            employeeSpending
        },
        recentRFQs,
        recentPOs
    };

    res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully.'));
});
