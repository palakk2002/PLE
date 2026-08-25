/**
 * Chat Moderation Service
 * ─────────────────────────────────────────────────────────────
 * Context-aware moderation for User ↔ Vendor store chat.
 * Prevents sharing of phone numbers, UPI IDs, bank details,
 * payment links, emails, and external contact platform info.
 *
 * Designed with false-positive prevention as a top priority:
 *   "2 packets", "₹500", "500 gram", "Order #123" → ALLOW
 *   "9876543210 call karo", "abc@ybl"              → BLOCK
 */

// ── Moderation Actions ────────────────────────────────────────
export const MODERATION_ACTION = Object.freeze({
    ALLOW: 'ALLOW',
    BLOCK: 'BLOCK',
    FLAG:  'FLAG',
});

// ── Moderation Categories ─────────────────────────────────────
export const MODERATION_CATEGORY = Object.freeze({
    PHONE_NUMBER:     'PHONE_NUMBER',
    UPI_ID:           'UPI_ID',
    BANK_DETAILS:     'BANK_DETAILS',
    IFSC:             'IFSC',
    PAYMENT_LINK:     'PAYMENT_LINK',
    EMAIL:            'EMAIL',
    EXTERNAL_CONTACT: 'EXTERNAL_CONTACT',
    EXTERNAL_PAYMENT: 'EXTERNAL_PAYMENT',
    SUSPICIOUS:       'SUSPICIOUS',
});

// ── User-safe messages keyed by category ─────────────────────
const USER_MESSAGES = {
    [MODERATION_CATEGORY.PHONE_NUMBER]:     'Message not sent. Contact information cannot be shared in chat. Please continue communication through the platform.',
    [MODERATION_CATEGORY.EMAIL]:            'Message not sent. Contact information cannot be shared in chat. Please continue communication through the platform.',
    [MODERATION_CATEGORY.EXTERNAL_CONTACT]: 'Message not sent. External contact information cannot be shared in chat. Please continue communication through the platform.',
    [MODERATION_CATEGORY.UPI_ID]:           'Message not sent. External payment details cannot be shared in chat. Please use the platform\'s payment system.',
    [MODERATION_CATEGORY.BANK_DETAILS]:     'Message not sent. External payment details cannot be shared in chat. Please use the platform\'s payment system.',
    [MODERATION_CATEGORY.IFSC]:             'Message not sent. External payment details cannot be shared in chat. Please use the platform\'s payment system.',
    [MODERATION_CATEGORY.PAYMENT_LINK]:     'Message not sent. External payment links cannot be shared in chat. Please use the platform\'s payment system.',
    [MODERATION_CATEGORY.EXTERNAL_PAYMENT]: 'Message not sent. External payment details cannot be shared in chat. Please use the platform\'s payment system.',
    [MODERATION_CATEGORY.SUSPICIOUS]:       'Message not sent. This content cannot be shared in chat.',
};

// ─────────────────────────────────────────────────────────────
// NORMALIZATION
// ─────────────────────────────────────────────────────────────

/**
 * Normalize text for detection:
 * - Lowercase
 * - Normalize unicode (NFKC)
 * - Convert (at) / [at] obfuscation
 * - Collapse zero-width chars
 */
export function normalizeText(text) {
    if (typeof text !== 'string') return '';
    return text
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\u200b|\u200c|\u200d|\ufeff/g, '') // zero-width chars
        .replace(/\(at\)|\[at\]|\bat\b(?=\s*\w+\s*\.\s*\w)/gi, '@') // (at) → @
        .replace(/\(dot\)|\[dot\]/gi, '.'); // (dot) → .
}

/**
 * Strip separators (spaces, dashes, dots) between digits.
 * Used specifically for phone-number detection.
 * Example: "98765 43210" → "9876543210"
 * Example: "98765-43210" → "9876543210"
 */
function collapseDigitSeparators(text) {
    // Only collapse separators that are strictly between digit characters
    return text.replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2') // run twice for "9 8 7 6..."
               .replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2')
               .replace(/(\d)[\s\-.](\d)/g, '$1$2');
}

// ─────────────────────────────────────────────────────────────
// PHONE NUMBER DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * Context indicators that a number is NOT a phone number.
 * If any of these precede or follow the digit sequence, we skip detection.
 */
const PRODUCT_CONTEXT_BEFORE = /(?:₹|rs\.?|inr|#|order|product|model|qty|quantity|kg|gram|gm|litre|ltr|ml|piece|pcs|pack|packet|set|box|unit|no\.?|serial|code|pin|otp|id|batch)\s*$/i;
const PRODUCT_CONTEXT_AFTER  = /^\s*(?:kg|gram|gm|litre|ltr|ml|piece|pcs|pack|packet|set|box|unit|%|rs\.?|₹|inr|-|\+)/i;

/**
 * Detects Indian mobile numbers:
 * - 10 digits starting with 6-9
 * - Optional +91 / 0 prefix
 * - Handles spaces/dashes between digits
 *
 * Returns true if a high-confidence phone number is detected
 * (i.e., not preceded/followed by product context).
 */
export function detectPhoneNumber(text) {
    const norm = normalizeText(text);
    const collapsed = collapseDigitSeparators(norm);

    // Pattern: optional (+91 or 91 or 0) + 10 digits starting with [6-9]
    const phonePattern = /(?:\+91|91|0)?([6-9]\d{9})/g;

    let match;
    while ((match = phonePattern.exec(collapsed)) !== null) {
        const digitSeq = match[1]; // the 10-digit part
        const matchStart = match.index;
        const matchEnd   = match.index + match[0].length;

        const before = collapsed.slice(0, matchStart);
        const after  = collapsed.slice(matchEnd);

        // Skip if surrounded by product-context tokens
        if (PRODUCT_CONTEXT_BEFORE.test(before)) continue;
        if (PRODUCT_CONTEXT_AFTER.test(after))  continue;

        // Skip very short numbers misidentified (shouldn't happen with 10-digit regex, but safety)
        if (digitSeq.length !== 10) continue;

        // Skip if this looks like an order ID or product ID (surrounded by # or alphanumeric ID context)
        if (/[#\/]/.test(before.slice(-2))) continue;

        return true;
    }
    return false;
}

// ─────────────────────────────────────────────────────────────
// UPI ID DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * Known UPI handle suffixes used by major providers.
 * This list is the authoritative set — detect only these to avoid
 * false positives from arbitrary @ usage.
 */
const UPI_HANDLES = [
    'ybl', 'paytm', 'ptyes', 'okaxis', 'oksbi', 'okhdfcbank', 'okicici',
    'ibl', 'upi', 'apl', 'waaxis', 'fbl', 'axl', 'hdfcbank', 'sbi',
    'icici', 'barodampay', 'axisbank', 'kotak', 'indus', 'rbl',
    'pnb', 'centralbank', 'cbi', 'ubi', 'unionbank', 'idbi', 'federal',
    'mahb', 'jkb', 'aubank', 'abfspay', 'tapicici', 'jupiteraxis',
    'sliceaxis', 'icicibank', 'hsbc', 'sc', 'yesbank',
];

const UPI_HANDLE_REGEX = new RegExp(
    `[a-z0-9._\\-]{1,50}@(?:${UPI_HANDLES.join('|')})\\b`,
    'i'
);

/**
 * Detects UPI IDs (e.g., "abc@ybl", "name@okaxis").
 * Handles obfuscation: "abc @ ybl", "abc(at)ybl"
 */
export function detectUPI(text) {
    const norm = normalizeText(text);
    // Also check collapsed form (e.g., "abc @ ybl" → "abc@ybl")
    const noSpaceAroundAt = norm.replace(/\s*@\s*/g, '@');
    return UPI_HANDLE_REGEX.test(noSpaceAroundAt);
}

// ─────────────────────────────────────────────────────────────
// BANK DETAILS DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * IFSC code pattern: 4 alpha + 0 + 6 alphanumeric
 * Example: HDFC0001234, SBIN0000001
 */
const IFSC_PATTERN = /\b[A-Z]{4}0[A-Z0-9]{6}\b/i;

/**
 * Bank account number: 9-18 digit standalone number
 * Only flagged when combined with banking keywords nearby.
 */
const BANK_ACCOUNT_PATTERN = /\b\d{9,18}\b/;

const BANK_KEYWORDS = /\b(?:account|acc|bank\s*account|a\/c|ifsc|neft|rtgs|imps|beneficiary|routing|sort\s*code)\b/i;

/**
 * Detects high-confidence bank details:
 * - IFSC code alone → BLOCK
 * - Long number + banking keyword nearby → BLOCK
 */
export function detectBankDetails(text) {
    const norm = normalizeText(text);
    if (IFSC_PATTERN.test(norm)) return { found: true, category: MODERATION_CATEGORY.IFSC };
    if (BANK_ACCOUNT_PATTERN.test(norm) && BANK_KEYWORDS.test(norm)) {
        return { found: true, category: MODERATION_CATEGORY.BANK_DETAILS };
    }
    return { found: false };
}

// ─────────────────────────────────────────────────────────────
// PAYMENT LINK DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * Detects external payment links.
 * - upi:// deep links
 * - Known payment gateway URLs
 * - Generic payment/checkout URLs from non-platform domains
 */
const PAYMENT_LINK_PATTERNS = [
    /upi:\/\//i,
    /pay\.google\.com/i,
    /paytm\.com\/pay/i,
    /phonepay\.com|phonepe\.com/i,
    /bhimupi\.org\.in/i,
    /rzp\.io\//i,         // Razorpay short links
    /instamojo\.com/i,
    /easebuzz\.in/i,
    /cashfree\.com/i,
    /payumoney\.com/i,
    /\/payment\?|\/pay\?|\/checkout\?/i,
];

export function detectPaymentLink(text) {
    const norm = normalizeText(text);
    return PAYMENT_LINK_PATTERNS.some(p => p.test(norm));
}

// ─────────────────────────────────────────────────────────────
// EMAIL DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * Standard email pattern.
 * Handles obfuscated "abc (at) gmail.com" form via normalizeText.
 */
const EMAIL_PATTERN = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/i;

export function detectEmail(text) {
    const norm = normalizeText(text);
    const noSpaceAroundAt = norm.replace(/\s*@\s*/g, '@');
    return EMAIL_PATTERN.test(noSpaceAroundAt);
}

// ─────────────────────────────────────────────────────────────
// EXTERNAL CONTACT PLATFORM DETECTION (Context-Aware)
// ─────────────────────────────────────────────────────────────

/**
 * Contact platform keywords.
 * We require BOTH a platform keyword AND an action/contact phrase
 * to avoid blocking innocent mentions like "what is WhatsApp?"
 */
const CONTACT_PLATFORM_KEYWORDS = [
    'whatsapp', 'whats app', 'w h a t s a p p', 'watsapp',
    'telegram', 't e l e g r a m',
    'signal',
    'instagram', 'insta',
    'facebook', 'fb',
    'snapchat',
    'skype',
    'viber',
];

/**
 * Action phrases indicating intent to move off-platform.
 * Bilingual (Hindi / English) patterns.
 */
const CONTACT_ACTION_PHRASES = [
    /\bpar\s+(?:baat|contact|message|msg|chat|call|text|ping|dm)\b/i,
    /\bpe\s+(?:baat|contact|message|msg|chat|call|text|ping|dm)\b/i,
    /\bpar\s+(?:aao|aana|aajao|milte\s+hain)\b/i,
    /\bcontact\s+(?:karo|karna|kijiye|kare)\b/i,
    /\bmessage\s+(?:karo|karna|kijiye)\b/i,
    /\bcall\s+(?:karo|karna|kijiye|me|kar)\b/i,
    /\bme\s+(?:add|dm|message|call)\b/i,
    /\b(?:add|dm|message|contact|reach|text)\s+me\b/i,
    /\bmujhe\s+(?:call|message|contact)\b/i,
    /\bnumber\s+(?:do|dena|dijiye|bhejo|send)\b/i,
    /\bpe\s+milte\b/i,
    /\bpar\s+aao\b/i,
    /\bchat\s+(?:karte|karo|karna)\b/i,
    /\bconnect\s+(?:on|karo|karna)\b/i,
    /\b(?:shift|move|continue)\s+(?:to|on|par)\b/i,
    /\bbahar\s+(?:baat|contact)\b/i,
];

export function detectExternalContact(text) {
    const norm = normalizeText(text);

    const hasPlatformKeyword = CONTACT_PLATFORM_KEYWORDS.some(kw => norm.includes(kw));
    if (!hasPlatformKeyword) return false;

    // Require an action phrase too (context-aware)
    const hasActionPhrase = CONTACT_ACTION_PHRASES.some(p => p.test(norm));
    return hasActionPhrase;
}

// ─────────────────────────────────────────────────────────────
// EXTERNAL PAYMENT METHOD DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * Payment app keywords.
 */
const PAYMENT_APP_KEYWORDS = [
    'phonepay', 'phonepe', 'phone pe',
    'google pay', 'gpay', 'googlepay',
    'paytm',
    'bhim', 'bhim upi',
    'amazon pay', 'amazonpay',
];

/**
 * Direct payment action phrases (bilingual).
 */
const PAYMENT_ACTION_PHRASES = [
    /\b(?:direct\s+)?upi\s+(?:kar\s*do|karo|karna|bhej|send|pay|payment)\b/i,
    /\b(?:kar\s+do|karo|karna|bhej\s*do|bhejna|send|transfer|pay)\b.{0,30}\b(?:account|upi|bank|neft|rtgs|imps)\b/i,
    /\bbank\s+transfer\s+(?:kar|karo|karna|kijiye|do)\b/i,
    /\bdirect\s+payment\b/i,
    /\bplatform\s+ke\s+bahar\b/i,
    /\bbahar\s+(?:payment|pay)\b/i,
    /\bcash\s+(?:de\s*do|dena|dijiye|bhejo)\b/i,
    /\bpayment\s+(?:kar\s*do|karo|karna|bhej|bhejo)\b/i,
    /\bpaise\s+(?:bhej\s*do|bhejna|bhejo|transfer|de\s*do)\b/i,
    /\bmere\s+(?:account|upi)\s+mein\b/i,
    /\bqr\s+(?:scan|code)\s+(?:kar|karke)\b/i,
    /\bscan\s+(?:and|&|karke)\s+pay\b/i,
];

export function detectExternalPayment(text) {
    const norm = normalizeText(text);

    const hasPaymentApp = PAYMENT_APP_KEYWORDS.some(kw => norm.includes(kw));
    const hasPaymentAction = PAYMENT_ACTION_PHRASES.some(p => p.test(norm));

    // Either: payment app + action, or standalone off-platform payment action
    if (hasPaymentApp && hasPaymentAction) return true;
    if (!hasPaymentApp && hasPaymentAction) return true; // e.g. "direct UPI kar do"
    if (hasPaymentApp) {
        // Payment app mentioned alone — FLAG (lower confidence), not BLOCK
        // e.g., "PhonePe kya hai?" should not necessarily block
        // But "PhonePe par payment" → combined intent
        if (/\bpar\s+payment\b|\bse\s+pay\b|\bwala\s+payment\b|\bpe\s+(?:pay|payment|bhej)\b/i.test(norm)) return true;
    }

    return false;
}

// ─────────────────────────────────────────────────────────────
// MAIN MODERATION FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Runs all detectors in priority order.
 * Returns a moderation result object.
 *
 * @param {string} text — raw message text
 * @returns {{ action: string, category: string|null, reason: string, userMessage: string }}
 */
export function moderateMessage(text) {
    if (!text || typeof text !== 'string') {
        return { action: MODERATION_ACTION.ALLOW, category: null, reason: 'empty', userMessage: '' };
    }

    // 1. Payment Link — always BLOCK (check before UPI to avoid upi:// being caught as UPI_ID)
    if (detectPaymentLink(text)) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    MODERATION_CATEGORY.PAYMENT_LINK,
            reason:      'External payment link detected',
            userMessage: USER_MESSAGES[MODERATION_CATEGORY.PAYMENT_LINK],
        };
    }

    // 2. UPI ID — high confidence, always BLOCK
    if (detectUPI(text)) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    MODERATION_CATEGORY.UPI_ID,
            reason:      'UPI ID detected in message',
            userMessage: USER_MESSAGES[MODERATION_CATEGORY.UPI_ID],
        };
    }

    // 3. Email — BLOCK (prevents off-platform contact)
    if (detectEmail(text)) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    MODERATION_CATEGORY.EMAIL,
            reason:      'Email address detected in message',
            userMessage: USER_MESSAGES[MODERATION_CATEGORY.EMAIL],
        };
    }

    // 4. Bank Details — BLOCK
    const bankResult = detectBankDetails(text);
    if (bankResult.found) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    bankResult.category,
            reason:      'Bank/payment details detected in message',
            userMessage: USER_MESSAGES[bankResult.category],
        };
    }

    // 5. Phone Number — BLOCK (context-aware)
    if (detectPhoneNumber(text)) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    MODERATION_CATEGORY.PHONE_NUMBER,
            reason:      'Phone number detected in message',
            userMessage: USER_MESSAGES[MODERATION_CATEGORY.PHONE_NUMBER],
        };
    }

    // 6. External Payment Methods — BLOCK
    if (detectExternalPayment(text)) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    MODERATION_CATEGORY.EXTERNAL_PAYMENT,
            reason:      'External payment instruction detected',
            userMessage: USER_MESSAGES[MODERATION_CATEGORY.EXTERNAL_PAYMENT],
        };
    }

    // 7. External Contact Platforms — BLOCK (context-aware)
    if (detectExternalContact(text)) {
        return {
            action:      MODERATION_ACTION.BLOCK,
            category:    MODERATION_CATEGORY.EXTERNAL_CONTACT,
            reason:      'External contact platform sharing detected',
            userMessage: USER_MESSAGES[MODERATION_CATEGORY.EXTERNAL_CONTACT],
        };
    }

    // All clear
    return {
        action:      MODERATION_ACTION.ALLOW,
        category:    null,
        reason:      'No prohibited content detected',
        userMessage: '',
    };
}
