import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import B2BCompany from '../../../models/B2BCompany.model.js';
import User from '../../../models/User.model.js';
import { sendEmail } from '../../../services/email.service.js';

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/admin/b2b-users
export const getAllB2BUsers = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20, search } = req.query;
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const skip = (numericPage - 1) * numericLimit;
    const filter = {};

    if (status && status !== 'all') {
        if (status === 'pending') filter.verificationStatus = 'Pending Verification';
        else if (status === 'approved') filter.verificationStatus = 'Approved';
        else if (status === 'rejected') filter.verificationStatus = 'Rejected';
    }

    const trimmedSearch = String(search || '').trim();
    if (trimmedSearch) {
        const safeRegex = new RegExp(escapeRegex(trimmedSearch), 'i');
        filter.$or = [{ companyName: safeRegex }, { businessEmail: safeRegex }, { gstNumber: safeRegex }];
    }

    const b2bCompanies = await B2BCompany.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean();
        
    const total = await B2BCompany.countDocuments(filter);
    
    // Enrich with Admin and Employees count
    const enrichedCompanies = await Promise.all(b2bCompanies.map(async (company) => {
        const admin = await User.findOne({ companyId: company._id, role: 'b2bAdmin' }).lean();
        if (admin) {
            admin.adminName = admin.name;
            admin.adminEmail = admin.email;
        }
        const employeeCount = await User.countDocuments({ companyId: company._id, role: 'b2bEmployee' });
        return {
            ...company,
            admin,
            employeeCount
        };
    }));

    res.status(200).json(
        new ApiResponse(200, {
            b2bUsers: enrichedCompanies,
            total,
            page: numericPage,
            pages: Math.ceil(total / numericLimit)
        }, 'B2B Users fetched.')
    );
});

// GET /api/admin/b2b-users/:id
export const getB2BUserDetail = asyncHandler(async (req, res) => {
    const company = await B2BCompany.findById(req.params.id).lean();
    if (!company) throw new ApiError(404, 'B2B Company not found.');

    const admin = await User.findOne({ companyId: company._id, role: 'b2bAdmin' })
        .select('-password -otp -otpExpiry -resetOtp -resetOtpExpiry -refreshTokenHash -refreshTokenExpiresAt')
        .lean();
    if (admin) {
        admin.adminName = admin.name;
        admin.adminEmail = admin.email;
    }
    const employees = await User.find({ companyId: company._id, role: 'b2bEmployee' })
        .select('-password')
        .lean();

    res.status(200).json(new ApiResponse(200, { company, admin, employees }, 'B2B User detail fetched.'));
});

// PATCH /api/admin/b2b-users/:id/status
export const updateB2BUserStatus = asyncHandler(async (req, res) => {
    const { status, reason } = req.body;
    
    let dbStatus;
    if (status === 'approved') dbStatus = 'Approved';
    else if (status === 'rejected') dbStatus = 'Rejected';
    else throw new ApiError(400, `Status must be one of: approved, rejected`);

    // Fetch current company first to check if already rejected
    const currentCompany = await B2BCompany.findById(req.params.id);
    if (!currentCompany) throw new ApiError(404, 'B2B Company not found.');

    if (currentCompany.verificationStatus === 'Rejected') {
        throw new ApiError(400, 'Cannot update status of a permanently rejected B2B User.');
    }

    const company = await B2BCompany.findByIdAndUpdate(
        req.params.id, 
        { verificationStatus: dbStatus }, 
        { new: true }
    );
    
    const admin = await User.findOne({ companyId: company._id, role: 'b2bAdmin' });

    let emailSubject = '';
    let emailMessage = '';

    if (dbStatus === 'Approved') {
        emailSubject = 'B2B Account Approved - Ready for Login';
        emailMessage = `
            <h2>Congratulations!</h2>
            <p>Dear ${company.companyName},</p>
            <p>Your B2B account has been successfully verified and approved by the administrator.</p>
            <p><strong>You are now able to login</strong> to your account using your registered Admin email (${admin ? admin.email : company.businessEmail}) and password.</p>
            <br/>
            <p>Thank you for partnering with us.</p>
        `;
    } else if (dbStatus === 'Rejected') {
        emailSubject = 'B2B Account Registration Update';
        emailMessage = `
            <h2>Account Update</h2>
            <p>Dear ${company.companyName},</p>
            <p>Unfortunately, your B2B account registration could not be approved at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <br/>
            <p>If you believe this is a mistake, please contact support.</p>
        `;
    }

    if (emailSubject) {
        try {
            const targetEmail = admin ? admin.email : company.businessEmail;

            await sendEmail({
                to: targetEmail, // Send only to Admin email
                subject: emailSubject,
                text: emailMessage.replace(/<[^>]+>/g, ''), // Strip HTML for text version
                html: emailMessage,
            });
        } catch (err) {
            console.warn(`B2B User status email failed: ${err.message}`);
        }
    }

    res.status(200).json(new ApiResponse(200, company, `B2B User ${status} successfully.`));
});

// DELETE /api/admin/b2b-users/:id
export const deleteB2BUser = asyncHandler(async (req, res) => {
    const company = await B2BCompany.findById(req.params.id);
    if (!company) throw new ApiError(404, 'B2B Company not found.');

    // Delete Company, Admin, and Employees
    await B2BCompany.findByIdAndDelete(company._id);
    await User.deleteMany({ companyId: company._id });

    res.status(200).json(new ApiResponse(200, null, 'B2B User permanently deleted.'));
});
