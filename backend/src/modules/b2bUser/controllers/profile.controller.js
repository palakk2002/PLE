import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import B2BCompany from '../../../models/B2BCompany.model.js';
import User from '../../../models/User.model.js';

/**
 * @desc    Get company profile
 * @route   GET /api/b2b-user/admin/company
 * @access  Private (B2B Admin)
 */
export const getCompanyProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found.');
    }

    const company = await B2BCompany.findById(user.companyId);

    if (!company) {
        throw new ApiError(404, 'Company not found.');
    }

    const companyAdmin = await User.findOne({ companyId: user.companyId, role: 'b2bAdmin' });
    const companyObj = company.toObject();
    if (companyAdmin) {
        companyObj.admin = {
            name: companyAdmin.name,
            email: companyAdmin.email,
            phone: companyAdmin.phone
        };
    }

    res.status(200).json(new ApiResponse(200, companyObj, 'Company profile fetched successfully.'));
});

/**
 * @desc    Update company profile
 * @route   PUT /api/b2b-user/admin/company
 * @access  Private (B2B Admin)
 */
export const updateCompanyProfile = asyncHandler(async (req, res) => {
    const adminId = req.user.id;
    
    const admin = await User.findById(adminId);
    if (!admin) {
        throw new ApiError(404, 'User not found.');
    }

    const companyId = admin.companyId;
    const updates = req.body;

    // Prevent updating critical fields
    delete updates.verificationStatus;
    delete updates.businessEmail;
    delete updates.gstNumber;

    const company = await B2BCompany.findByIdAndUpdate(
        companyId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!company) {
        throw new ApiError(404, 'Company not found.');
    }

    res.status(200).json(new ApiResponse(200, company, 'Company profile updated successfully.'));
});

/**
 * @desc    Get admin profile
 * @route   GET /api/b2b-user/admin/profile
 * @access  Private (B2B Admin)
 */
export const getAdminProfile = asyncHandler(async (req, res) => {
    const adminId = req.user.id || req.user._id;

    const admin = await User.findById(adminId);

    if (!admin) {
        throw new ApiError(404, 'User not found.');
    }

    const adminResponse = admin.toObject();
    adminResponse.adminName = admin.name;
    adminResponse.adminEmail = admin.email;
    adminResponse.adminPhone = admin.phone;

    res.status(200).json(new ApiResponse(200, adminResponse, 'Profile fetched successfully.'));
});

/**
 * @desc    Update admin profile
 * @route   PUT /api/b2b-user/admin/profile
 * @access  Private (B2B Admin)
 */
export const updateAdminProfile = asyncHandler(async (req, res) => {
    const adminId = req.user.id || req.user._id;
    const { adminName, adminEmail, adminPhone, name, phone, newPassword, secretKey } = req.body;

    if (!secretKey) {
        throw new ApiError(400, 'Company Owner Secret Key is required to update credentials.');
    }

    const admin = await User.findById(adminId).select('+password');
    if (!admin) {
        throw new ApiError(404, 'User not found.');
    }

    const company = await B2BCompany.findById(admin.companyId).select('+ownerSecretKey');
    if (!company) {
        throw new ApiError(404, 'B2B Company not found.');
    }

    const isSecretKeyCorrect = await company.compareSecretKey(secretKey);
    if (!isSecretKeyCorrect) {
        throw new ApiError(403, 'Invalid Company Owner Secret Key.');
    }

    if (adminName || name) admin.name = adminName || name;
    if (adminPhone || phone) admin.phone = adminPhone || phone;

    const emailToUpdate = adminEmail || req.body.email;
    if (emailToUpdate && emailToUpdate.toLowerCase() !== admin.email.toLowerCase()) {
        const existingUser = await User.findOne({ email: emailToUpdate.toLowerCase() });
        if (existingUser) {
            throw new ApiError(400, 'A user with this email already exists.');
        }
        admin.email = emailToUpdate.toLowerCase();
    }

    if (newPassword) {
        admin.password = newPassword;
    }

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    adminResponse.adminName = admin.name;
    adminResponse.adminEmail = admin.email;
    adminResponse.adminPhone = admin.phone;

    res.status(200).json(new ApiResponse(200, adminResponse, 'Profile updated successfully.'));
});
