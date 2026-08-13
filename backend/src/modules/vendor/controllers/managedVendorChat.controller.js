import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ManagedVendorUser from '../../../models/ManagedVendorUser.model.js';
import AdminManagedVendorThread from '../../../models/AdminManagedVendorThread.model.js';
import AdminManagedVendorMessage from '../../../models/AdminManagedVendorMessage.model.js';
import Admin from '../../../models/Admin.model.js';
import { getIO } from '../../../config/socket.js';

const serializeMessage = (msg) => ({
    id: msg._id,
    threadId: msg.threadId,
    senderType: msg.senderType,
    senderId: msg.senderId,
    senderName: msg.senderName,
    message: msg.message,
    attachments: msg.attachments || [],
    isRead: msg.isRead,
    createdAt: msg.createdAt,
});

/**
 * Get or initialize thread for logged-in Managed Vendor
 */
export const getManagedVendorThread = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;

    const vendor = await ManagedVendorUser.findById(vendorId).lean();
    if (!vendor) {
        throw new ApiError(404, 'Managed Vendor user profile not found.');
    }

    let adminId = vendor.createdBy;
    if (!adminId) {
        const firstAdmin = await Admin.findOne().select('_id').lean();
        adminId = firstAdmin?._id;
    }

    let thread = await AdminManagedVendorThread.findOne({
        managedVendorId: vendorId,
    }).populate('adminId', 'name email role');

    if (!thread) {
        thread = await AdminManagedVendorThread.create({
            adminId,
            managedVendorId: vendorId,
            shopId: vendor.shopId || null,
            lastMessage: 'Welcome to Support Chat',
            lastSenderType: 'admin',
            lastActivity: new Date(),
        });
        thread = await AdminManagedVendorThread.findById(thread._id).populate('adminId', 'name email role');
    }

    res.status(200).json(new ApiResponse(200, thread, 'Managed vendor chat thread retrieved.'));
});

/**
 * Get messages for logged-in Managed Vendor's thread
 */
export const getManagedVendorMessages = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;

    const thread = await AdminManagedVendorThread.findOne({ managedVendorId: vendorId });
    if (!thread) {
        return res.status(200).json(new ApiResponse(200, [], 'No messages found.'));
    }

    // Reset unread count for vendor
    thread.unreadCountVendor = 0;
    await thread.save();

    const messages = await AdminManagedVendorMessage.find({ threadId: thread._id })
        .sort({ createdAt: 1 })
        .lean();

    res.status(200).json(
        new ApiResponse(200, messages.map(serializeMessage), 'Messages fetched successfully.')
    );
});

/**
 * Send message from Managed Vendor to Admin
 */
export const sendManagedVendorMessage = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;
    const { message, attachments } = req.body;

    if (!message || !message.trim()) {
        throw new ApiError(400, 'Message body cannot be empty.');
    }

    const vendor = await ManagedVendorUser.findById(vendorId).lean();
    if (!vendor) {
        throw new ApiError(404, 'Managed Vendor user not found.');
    }

    let thread = await AdminManagedVendorThread.findOne({ managedVendorId: vendorId });
    if (!thread) {
        let adminId = vendor.createdBy;
        if (!adminId) {
            const firstAdmin = await Admin.findOne().select('_id').lean();
            adminId = firstAdmin?._id;
        }
        thread = await AdminManagedVendorThread.create({
            adminId,
            managedVendorId: vendorId,
            shopId: vendor.shopId || null,
            lastMessage: message.trim(),
            lastSenderType: 'managed_vendor',
            lastActivity: new Date(),
        });
    }

    const created = await AdminManagedVendorMessage.create({
        threadId: thread._id,
        senderType: 'managed_vendor',
        senderId: vendorId,
        senderName: vendor.name || vendor.username || 'Managed Vendor',
        message: message.trim(),
        attachments: attachments || [],
    });

    thread.lastMessage = message.trim();
    thread.lastSenderType = 'managed_vendor';
    thread.lastActivity = new Date();
    thread.unreadCountAdmin += 1;
    await thread.save();

    const payload = serializeMessage(created);

    try {
        const io = getIO();
        // Broadcast to chat room
        io.to(`chat_${thread._id}`).emit('new_admin_managed_vendor_message', payload);
        // Broadcast to admin room
        io.to('admin_room').emit('admin_chat_notification', {
            threadId: thread._id,
            senderName: vendor.name || vendor.username,
            message: message.trim(),
            createdAt: created.createdAt,
        });
    } catch (err) {
        console.error('Socket notification error:', err.message);
    }

    res.status(201).json(new ApiResponse(201, payload, 'Message sent successfully.'));
});

/**
 * Mark thread read by Managed Vendor
 */
export const markManagedVendorThreadRead = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;

    const thread = await AdminManagedVendorThread.findOne({ managedVendorId: vendorId });
    if (!thread) {
        throw new ApiError(404, 'Thread not found.');
    }

    thread.unreadCountVendor = 0;
    await thread.save();

    await AdminManagedVendorMessage.updateMany(
        { threadId: thread._id, senderType: 'admin', isRead: false },
        { $set: { isRead: true } }
    );

    res.status(200).json(new ApiResponse(200, { threadId: thread._id }, 'Thread marked as read.'));
});
