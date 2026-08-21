import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import {
    uploadLocalFileToCloudinaryAndCleanup,
    uploadLocalFileToCloudinaryAndCleanupWithType,
    cleanupLocalFiles,
} from '../../../services/upload.service.js';

/**
 * @desc    Upload single image to Cloudinary via temp local file
 * @route   POST /api/admin/uploads/image
 * @access  Private (Admin)
 */
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file?.path) {
        throw new ApiError(400, 'Image file is required');
    }

    const folder = (req.body?.folder || 'general').toString().trim() || 'general';
    const publicId = req.body?.publicId ? String(req.body.publicId).trim() : undefined;

    try {
        const uploaded = await uploadLocalFileToCloudinaryAndCleanup(req.file.path, folder, publicId);
        return res.status(201).json(
            new ApiResponse(201, uploaded, 'Image uploaded successfully')
        );
    } catch (error) {
        await cleanupLocalFiles([req.file.path]);
        throw error;
    }
});

/**
 * @desc    Upload single media file (image/video) to Cloudinary via temp local file
 * @route   POST /api/admin/uploads/media
 * @access  Private (Admin)
 */
export const uploadMedia = asyncHandler(async (req, res) => {
    if (!req.file?.path) {
        throw new ApiError(400, 'File is required');
    }

    const folder = (req.body?.folder || 'general').toString().trim() || 'general';
    const publicId = req.body?.publicId ? String(req.body.publicId).trim() : undefined;

    const PDF_DOCUMENT_MIMES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const isDocument = PDF_DOCUMENT_MIMES.includes(req.file.mimetype) || req.file.originalname?.toLowerCase().endsWith('.pdf');
    const resourceType = isDocument ? 'raw' : 'auto';

    try {
        const uploaded = await uploadLocalFileToCloudinaryAndCleanupWithType(
            req.file.path,
            folder,
            resourceType,
            publicId
        );
        return res.status(201).json(
            new ApiResponse(201, uploaded, 'Media uploaded successfully')
        );
    } catch (error) {
        await cleanupLocalFiles([req.file.path]);
        throw error;
    }
});

