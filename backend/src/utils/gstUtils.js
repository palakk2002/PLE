/**
 * Centralized GST resolution logic according to Seller-Controlled GST System rules.
 * Hierarchy:
 * 1. Product Custom GST (if product.gstMode === 'custom' and product.gstRate is specified)
 * 2. Category Default GST (if category/populated categoryId has gstRate)
 * 3. Product legacy taxRate / default fallback (18%)
 */
export const resolveProductGST = (product, category = null) => {
    if (!product) return 18;

    const mode = String(product.gstMode || '').toLowerCase();

    // 1. If product explicitly uses Custom GST mode
    if (mode === 'custom') {
        const customGst = Number(product.gstRate ?? product.taxRate);
        if (Number.isFinite(customGst) && customGst >= 0 && customGst <= 100) {
            return customGst;
        }
    }

    // 2. If Category is provided or populated on product
    const cat = category || (product.categoryId && typeof product.categoryId === 'object' ? product.categoryId : null);
    if (cat) {
        const catGst = Number(cat.gstRate);
        if (Number.isFinite(catGst) && catGst >= 0 && catGst <= 100) {
            return catGst;
        }
    }

    // 3. Fallback to product.gstRate or product.taxRate if numeric
    const prodGst = Number(product.gstRate ?? product.taxRate);
    if (Number.isFinite(prodGst) && prodGst >= 0 && prodGst <= 100) {
        return prodGst;
    }

    // 4. Platform default fallback
    return 18;
};

/**
 * Calculates taxable amount and GST amount for a given unit price, quantity, and GST rate.
 */
export const calculateItemGST = (unitPrice, quantity = 1, gstRate = 18, itemDiscount = 0, taxIncluded = false) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const price = Math.max(0, Number(unitPrice) || 0);
    const discount = Math.max(0, Number(itemDiscount) || 0);
    const rate = Math.max(0, Number(gstRate) || 0);

    const lineTotal = Math.max(0, price * qty - discount);

    if (taxIncluded) {
        // Price is inclusive of GST: LineTotal = Taxable + GST
        // Taxable = LineTotal / (1 + Rate/100)
        const taxableAmount = parseFloat((lineTotal / (1 + rate / 100)).toFixed(2));
        const gstAmount = parseFloat((lineTotal - taxableAmount).toFixed(2));
        return { taxableAmount, gstAmount, totalAmount: lineTotal, gstRate: rate };
    } else {
        // Price is exclusive of GST: Taxable = LineTotal, GST = Taxable * Rate / 100
        const taxableAmount = parseFloat(lineTotal.toFixed(2));
        const gstAmount = parseFloat(((taxableAmount * rate) / 100).toFixed(2));
        const totalAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));
        return { taxableAmount, gstAmount, totalAmount, gstRate: rate };
    }
};
