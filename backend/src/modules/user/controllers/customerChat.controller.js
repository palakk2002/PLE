import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import VendorChatThread from '../../../models/VendorChatThread.model.js';
import VendorChatMessage from '../../../models/VendorChatMessage.model.js';
import Vendor from '../../../models/Vendor.model.js';
import { getIO } from '../../../config/socket.js';
import { moderateMessage, MODERATION_ACTION } from '../../../services/chatModeration.service.js';
import ChatViolation from '../../../models/ChatViolation.model.js';

const serializeMessage = (messageDoc) => ({
    id: messageDoc._id,
    sender: messageDoc.senderType,
    message: messageDoc.message,
    time: messageDoc.createdAt,
});

export const initiateVendorChat = asyncHandler(async (req, res) => {
    const { vendorId } = req.body;
    if (!vendorId) throw new ApiError(400, 'Vendor ID is required.');

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new ApiError(404, 'Vendor not found.');

    // Find existing general chat thread for this user and vendor (no orderRef)
    let thread = await VendorChatThread.findOne({
        vendorId,
        customerUserId: req.user.id,
        orderRef: null,
    });

    if (!thread) {
        try {
            thread = await VendorChatThread.create({
                vendorId,
                customerUserId: req.user.id,
                customerName: req.user.name || 'Customer',
                customerEmail: req.user.email || '',
                customerPhone: req.user.phone || '',
                orderRef: null,
                orderDisplayId: '',
                lastMessage: 'Chat started',
                lastActivity: new Date(),
                unreadCount: 0,
                status: 'active',
            });
        } catch (error) {
            if (error.code === 11000) {
                thread = await VendorChatThread.findOne({
                    vendorId,
                    customerUserId: req.user.id,
                    orderRef: null,
                }) || await VendorChatThread.findOne({
                    vendorId,
                    customerUserId: req.user.id,
                });
            } else {
                throw error;
            }
        }
    }

    res.status(200).json(new ApiResponse(200, thread, 'Chat thread initiated successfully.'));
});

export const getCustomerChatThreads = asyncHandler(async (req, res) => {
    const threads = await VendorChatThread.find({ customerUserId: req.user.id })
        .populate('vendorId', 'name storeName storeLogo isVerified rating')
        .sort({ lastActivity: -1 });

    res.status(200).json(new ApiResponse(200, threads, 'Chat threads fetched.'));
});

export const getCustomerChatMessages = asyncHandler(async (req, res) => {
    const thread = await VendorChatThread.findOne({
        _id: req.params.id,
        customerUserId: req.user.id,
    });
    if (!thread) throw new ApiError(404, 'Chat thread not found.');

    const messages = await VendorChatMessage.find({ threadId: thread._id }).sort({ createdAt: 1 });

    res.status(200).json(new ApiResponse(200, messages.map(serializeMessage), 'Chat messages fetched.'));
});

export const sendCustomerChatMessage = asyncHandler(async (req, res) => {
    const message = String(req.body?.message || '').trim();
    if (!message) throw new ApiError(400, 'Message is required.');

    const thread = await VendorChatThread.findOne({
        _id: req.params.id,
        customerUserId: req.user.id,
    });
    if (!thread) throw new ApiError(404, 'Chat thread not found.');

    // ── Moderation Layer ──────────────────────────────────────
    const moderationResult = moderateMessage(message);

    if (moderationResult.action !== MODERATION_ACTION.ALLOW) {
        // Log the violation (no message content stored for privacy)
        try {
            await ChatViolation.create({
                threadId:   thread._id,
                senderId:   req.user.id,
                senderType: 'customer',
                vendorId:   thread.vendorId,
                category:   moderationResult.category,
                action:     moderationResult.action,
                direction:  'USER_TO_VENDOR',
                reason:     moderationResult.reason,
            });
        } catch (logErr) {
            console.warn('Failed to log chat violation:', logErr.message);
        }

        if (moderationResult.action === MODERATION_ACTION.BLOCK) {
            return res.status(422).json({
                success:  false,
                code:     'MESSAGE_BLOCKED',
                category: moderationResult.category,
                message:  moderationResult.userMessage,
            });
        }
        // FLAG: log but allow through
    }
    // ── End Moderation ────────────────────────────────────────

    const created = await VendorChatMessage.create({
        threadId: thread._id,
        senderType: 'customer',
        senderId: req.user.id,
        message,
    });

    thread.lastMessage = message;
    thread.lastActivity = created.createdAt;
    thread.unreadCount += 1; // Increment unread count for the vendor
    await thread.save();

    // Broadcast the message via Socket.io to the thread room
    try {
        const io = getIO();
        if (io) {
            io.to(`chat_${thread._id}`).emit('new_message', serializeMessage(created));
            // Also notify the vendor specifically in their user room
            io.to(`user_${thread.vendorId}`).emit('vendor_chat_notification', {
                threadId: thread._id,
                lastMessage: message,
            });
        }
    } catch (err) {
        console.warn('Socket broadcast failed:', err.message);
    }

    res.status(201).json(new ApiResponse(201, serializeMessage(created), 'Message sent.'));
});

export const markCustomerChatRead = asyncHandler(async (req, res) => {
    const thread = await VendorChatThread.findOne({
        _id: req.params.id,
        customerUserId: req.user.id,
    });
    if (!thread) throw new ApiError(404, 'Chat thread not found.');

    // For customers, marking as read can be a future implementation or dummy success
    res.status(200).json(new ApiResponse(200, thread, 'Chat marked as read.'));
});
