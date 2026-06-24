 import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import Settings from '../../../models/Settings.model.js';

/**
 * @desc    Get specific settings by key
 * @route   GET /api/admin/settings/:key
 * @access  Private (Admin)
 */
export const getSettings = asyncHandler(async (req, res) => {
    const { key } = req.params;
    
    const setting = await Settings.findOne({ key });
    
    // If not found, return empty object to allow frontend to use defaults
    res.status(200).json(new ApiResponse(200, setting ? setting.value : null, `Settings for ${key} fetched successfully.`));
});

/**
 * @desc    Update or create settings by key
 * @route   PUT /api/admin/settings/:key
 * @access  Private (Admin)
 */
export const updateSettings = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const value = req.body;
    
    let setting = await Settings.findOne({ key });
    
    if (setting) {
        setting.value = value;
        await setting.save();
    } else {
        setting = await Settings.create({ key, value });
    }
    
    res.status(200).json(new ApiResponse(200, setting.value, `Settings for ${key} updated successfully.`));
});
