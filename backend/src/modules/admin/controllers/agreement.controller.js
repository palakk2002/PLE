import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import AgreementTemplate from '../../../models/AgreementTemplate.model.js';
import { uploadLocalFileToCloudinaryAndCleanupWithType } from '../../../services/upload.service.js';
import { AGREEMENT_TEMPLATES } from '../../../config/agreementTemplates.js';

// GET /api/admin/b2b-users/agreement-templates/configs
export const getTemplateConfigs = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, Object.values(AGREEMENT_TEMPLATES), 'Predefined agreement configurations fetched.'));
});

// GET /api/admin/b2b-users/agreement-templates
export const getTemplates = asyncHandler(async (req, res) => {
    const templates = await AgreementTemplate.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, templates, 'All agreement templates fetched.'));
});

// POST /api/admin/b2b-users/agreement-templates
export const uploadTemplate = asyncHandler(async (req, res) => {
    const { templateKey } = req.body;
    if (!templateKey || !AGREEMENT_TEMPLATES[templateKey]) {
        throw new ApiError(400, 'Invalid or missing templateKey.');
    }
    if (!req.file) {
        throw new ApiError(400, 'No file uploaded.');
    }

    const config = AGREEMENT_TEMPLATES[templateKey];

    // Find the latest version of this template to increment version number
    const latestTemplate = await AgreementTemplate.findOne({ templateKey }).sort({ version: -1 });
    const nextVersion = latestTemplate ? latestTemplate.version + 1 : 1;

    const folder = `admin/agreement-templates/${templateKey.toLowerCase()}`;
    const result = await uploadLocalFileToCloudinaryAndCleanupWithType(req.file.path, folder, 'auto');

    // Deactivate previous active templates of the same templateKey
    await AgreementTemplate.updateMany({ templateKey, status: 'Active' }, { status: 'Inactive' });

    const template = await AgreementTemplate.create({
        templateName: config.name,
        templateKey,
        moduleType: config.moduleType,
        description: config.description,
        url: result.url,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        status: 'Active',
        version: nextVersion,
        uploadedBy: req.user?.id || req.user?._id
    });

    res.status(201).json(new ApiResponse(201, template, 'Agreement template uploaded successfully.'));
});

// PATCH /api/admin/b2b-users/agreement-templates/:id/status
export const toggleTemplateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
        throw new ApiError(400, 'Invalid status. Must be Active or Inactive.');
    }

    const template = await AgreementTemplate.findById(req.params.id);
    if (!template) {
        throw new ApiError(404, 'Template not found.');
    }

    if (status === 'Active') {
        // Deactivate other templates with the same templateKey
        await AgreementTemplate.updateMany(
            { templateKey: template.templateKey, _id: { $ne: template._id } },
            { status: 'Inactive' }
        );
    }

    template.status = status;
    await template.save();

    res.status(200).json(new ApiResponse(200, template, `Template status updated to ${status}.`));
});

// DELETE /api/admin/b2b-users/agreement-templates/:id
export const deleteTemplate = asyncHandler(async (req, res) => {
    const template = await AgreementTemplate.findById(req.params.id);
    if (!template) {
        throw new ApiError(404, 'Template not found.');
    }
    await AgreementTemplate.findByIdAndDelete(template._id);
    res.status(200).json(new ApiResponse(200, null, 'Template deleted successfully.'));
});
