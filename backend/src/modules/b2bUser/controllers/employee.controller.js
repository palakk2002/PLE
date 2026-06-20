import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import User from '../../../models/User.model.js';
import B2BCompany from '../../../models/B2BCompany.model.js';
import crypto from 'crypto';
import { sendEmail } from '../../../services/email.service.js';

const getCompanyId = async (req) => {
    let companyId = req.user.companyId;
    if (!companyId) {
        const admin = await User.findById(req.user.id);
        if (admin) companyId = admin.companyId;
    }
    if (!companyId) throw new ApiError(404, 'Admin not found or company ID missing.');
    return companyId;
};

/**
 * @desc    Get all employees for the B2B Company
 * @route   GET /api/b2b-user/admin/employees
 * @access  Private (B2B Admin)
 */
export const getEmployees = asyncHandler(async (req, res) => {
    const companyId = await getCompanyId(req);

    const employees = await User.find({ companyId: companyId, role: 'b2bEmployee' }).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, employees, 'Employees fetched successfully.'));
});

/**
 * @desc    Create a new employee
 * @route   POST /api/b2b-user/admin/employees
 * @access  Private (B2B Admin)
 */
export const createEmployee = asyncHandler(async (req, res) => {
    const companyId = await getCompanyId(req);
    const { firstName, lastName, email, phone, password, role, designation, department, address } = req.body;

    if (!firstName || !lastName || !email) {
        throw new ApiError(400, 'First name, last name, and email are required.');
    }

    const existingEmployee = await User.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
        throw new ApiError(400, 'A user with this email already exists.');
    }

    const generatedPassword = password || crypto.randomBytes(4).toString('hex');

    const newEmployee = await User.create({
        companyId: companyId,
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        email,
        phone,
        password: generatedPassword,
        role: 'b2bEmployee',
        b2bRole: role || 'Staff',
        designation,
        department,
        address,
        isActive: true,
        isVerified: true
    });

    const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`;
    const emailHtml = `
        <h2>Welcome to the B2B Platform!</h2>
        <p>You have been added as an employee.</p>
        <p><strong>Your Login Credentials:</strong></p>
        <ul>
            <li>Email: ${email}</li>
            <li>Password: ${generatedPassword}</li>
        </ul>
        <p>Please <a href="${loginUrl}">login here</a> and change your password as soon as possible.</p>
    `;

    try {
        await sendEmail({
            to: email,
            subject: 'Your B2B Employee Account Credentials',
            text: emailHtml.replace(/<[^>]+>/g, ''),
            html: emailHtml,
        });
    } catch (error) {
        console.error('Failed to send employee credentials email:', error);
    }

    const employeeResponse = newEmployee.toObject();
    delete employeeResponse.password;

    res.status(201).json(new ApiResponse(201, employeeResponse, 'Employee created successfully.'));
});

/**
 * @desc    Update an employee
 * @route   PUT /api/b2b-user/admin/employees/:id
 * @access  Private (B2B Admin)
 */
export const updateEmployee = asyncHandler(async (req, res) => {
    const companyId = await getCompanyId(req);
    const employeeId = req.params.id;

    const employee = await User.findOne({ _id: employeeId, companyId: companyId, role: 'b2bEmployee' });

    if (!employee) {
        throw new ApiError(404, 'Employee not found or unauthorized.');
    }

    const updates = req.body;
    
    // Prevent updating protected fields
    delete updates.companyId;
    delete updates.email; // Do not allow email update through this endpoint easily

    if (updates.firstName || updates.lastName) {
        const fn = updates.firstName || employee.firstName;
        const ln = updates.lastName || employee.lastName;
        updates.name = `${fn} ${ln}`.trim();
    }
    
    // Support mapping frontend role to b2bRole
    if (updates.role) {
        updates.b2bRole = updates.role;
        delete updates.role;
    }
    
    if (updates.status) {
        updates.isActive = updates.status === 'Active';
        delete updates.status;
    }
    
    // Only hash password if it is being explicitly updated and not empty
    if (updates.password) {
        // Will be hashed by pre-save hook, but we use findOneAndUpdate so we need to save explicitly if we want pre-save to run
        // Alternatively, hash it here:
        const bcrypt = await import('bcryptjs');
        updates.password = await bcrypt.default.hash(updates.password, 12);
    } else {
        delete updates.password;
    }

    const updatedEmployee = await User.findByIdAndUpdate(
        employeeId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, updatedEmployee, 'Employee updated successfully.'));
});

/**
 * @desc    Delete an employee
 * @route   DELETE /api/b2b-user/admin/employees/:id
 * @access  Private (B2B Admin)
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
    const companyId = await getCompanyId(req);
    const employeeId = req.params.id;

    const employee = await User.findOneAndDelete({ _id: employeeId, companyId: companyId, role: 'b2bEmployee' });

    if (!employee) {
        throw new ApiError(404, 'Employee not found or unauthorized.');
    }

    res.status(200).json(new ApiResponse(200, null, 'Employee deleted successfully.'));
});
