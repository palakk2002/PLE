/**
 * Chat Moderation — Frontend Message Mapping
 * ──────────────────────────────────────────────────────────────
 * Maps backend moderation categories to user-safe, friendly messages.
 * Never exposes internal implementation details (regex, confidence scores, etc.)
 */

/**
 * Returns a user-facing toast message based on the blocked category.
 * @param {string} category — from backend response.category
 * @returns {string}
 */
export function getChatBlockMessage(category) {
    switch (category) {
        case 'PHONE_NUMBER':
        case 'EMAIL':
        case 'EXTERNAL_CONTACT':
            return 'Message not sent. Contact information cannot be shared in chat. Please continue communication through the platform.';

        case 'UPI_ID':
        case 'BANK_DETAILS':
        case 'IFSC':
        case 'PAYMENT_LINK':
        case 'EXTERNAL_PAYMENT':
            return "Message not sent. External payment details cannot be shared in chat. Please use the platform's payment system.";

        case 'PAYMENT_QR':
            return 'Image not sent. Payment QR codes cannot be shared in chat.';

        case 'SUSPICIOUS':
        default:
            return 'Message not sent. This content cannot be shared in chat.';
    }
}
