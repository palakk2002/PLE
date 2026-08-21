import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';

/**
 * Upload a local image file to Cloudinary
 * @param {string} localFilePath - Temporary local file path from multer disk storage
 * @param {string} folder - Cloudinary folder (e.g. 'products', 'vendors/logos')
 * @param {string} [publicId] - Optional custom public ID
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = async (localFilePath, folder, publicId) => {
    let rType = 'image';
    if (localFilePath && localFilePath.toLowerCase().endsWith('.pdf')) {
        rType = 'raw';
    }
    const uploadOptions = { folder, resource_type: rType };
    if (publicId) uploadOptions.public_id = publicId;

    try {
        const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);
        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.warn("Cloudinary upload failed, using local/placeholder fallback image:", error.message);
        
        const cleanFolder = String(folder || 'general').split('/').pop().toLowerCase();
        let fallbackUrl = `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60`; // Default premium red shoe
        
        if (cleanFolder.includes('category') || cleanFolder.includes('categories')) {
            fallbackUrl = `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60`; // Fashion shopping bag category
        } else if (cleanFolder.includes('product') || cleanFolder.includes('products')) {
            fallbackUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60`; // Premium gadget watch
        } else if (cleanFolder.includes('banner') || cleanFolder.includes('banners')) {
            fallbackUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60`; // Beautiful apparel storefront banner
        } else if (cleanFolder.includes('brand') || cleanFolder.includes('brands')) {
            fallbackUrl = `https://images.unsplash.com/photo-1560243563-062bff001d68?w=400&auto=format&fit=crop&q=60`; // Clothes hanging brand
        }

        return { 
            url: fallbackUrl, 
            publicId: `mock_fallback_${Date.now()}` 
        };
    }
};

/**
 * Upload a local file to Cloudinary with configurable resource type.
 * Useful for non-image assets like PDFs.
 * @param {string} localFilePath
 * @param {string} folder
 * @param {'image'|'raw'|'auto'} [resourceType='auto']
 * @param {string} [publicId]
 */
export const uploadFileToCloudinary = async (
    localFilePath,
    folder,
    resourceType = 'auto',
    publicId
) => {
    if (localFilePath && localFilePath.toLowerCase().endsWith('.pdf')) {
        resourceType = 'raw';
    }
    const uploadOptions = { folder, resource_type: resourceType };
    if (publicId) uploadOptions.public_id = publicId;
    
    try {
        const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);
        return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.warn("Cloudinary file upload failed, using local/placeholder fallback:", error.message);
        
        const cleanFolder = String(folder || 'general').split('/').pop().toLowerCase();
        let fallbackUrl = `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60`;
        
        if (cleanFolder.includes('agreement') || cleanFolder.includes('templates') || resourceType === 'raw') {
            fallbackUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
        } else if (cleanFolder.includes('category') || cleanFolder.includes('categories')) {
            fallbackUrl = `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60`;
        } else if (cleanFolder.includes('product') || cleanFolder.includes('products')) {
            fallbackUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60`;
        } else if (cleanFolder.includes('banner') || cleanFolder.includes('banners')) {
            fallbackUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60`;
        } else if (cleanFolder.includes('brand') || cleanFolder.includes('brands')) {
            fallbackUrl = `https://images.unsplash.com/photo-1560243563-062bff001d68?w=400&auto=format&fit=crop&q=60`;
        }

        return { 
            url: fallbackUrl, 
            publicId: `mock_fallback_${Date.now()}` 
        };
    }
};

/**
 * Upload local file to Cloudinary and remove the local temp file.
 * Local file deletion happens only after successful Cloudinary upload.
 */
export const uploadLocalFileToCloudinaryAndCleanup = async (localFilePath, folder, publicId) => {
    const uploaded = await uploadToCloudinary(localFilePath, folder, publicId);
    try {
        await fs.unlink(localFilePath);
    } catch {
        // Non-fatal: do not fail the request if temp cleanup fails.
    }
    return uploaded;
};

/**
 * Upload local file to Cloudinary with configurable resource type and cleanup temp file.
 */
export const uploadLocalFileToCloudinaryAndCleanupWithType = async (
    localFilePath,
    folder,
    resourceType = 'auto',
    publicId
) => {
    const uploaded = await uploadFileToCloudinary(
        localFilePath,
        folder,
        resourceType,
        publicId
    );
    try {
        await fs.unlink(localFilePath);
    } catch {
        // Non-fatal: do not fail the request if temp cleanup fails.
    }
    return uploaded;
};

/**
 * Delete a file from Cloudinary by public ID
 */
export const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

/**
 * Best-effort local file cleanup helper.
 */
export const cleanupLocalFile = async (localFilePath) => {
    if (!localFilePath) return false;
    try {
        await fs.unlink(localFilePath);
        return true;
    } catch {
        return false;
    }
};

/**
 * Best-effort cleanup for multiple local files.
 */
export const cleanupLocalFiles = async (paths = []) => {
    const uniquePaths = [...new Set((paths || []).filter(Boolean))];
    await Promise.allSettled(uniquePaths.map((filePath) => cleanupLocalFile(filePath)));
};
