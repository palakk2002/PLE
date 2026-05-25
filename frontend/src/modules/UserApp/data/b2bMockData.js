/**
 * B2B Wholesale Pricing, MOQ, and Carton specs for products 1-20
 */
export const b2bProductSpecs = {
  // Classic White T-Shirt
  1: {
    moq: 25,
    unitsPerCarton: 50,
    gstSlab: 12,
    tiers: [
      { minQty: 25, price: 19.99 },
      { minQty: 100, price: 17.49 },
      { minQty: 250, price: 14.99 },
    ],
  },
  // Slim Fit Blue Jeans
  2: {
    moq: 15,
    unitsPerCarton: 30,
    gstSlab: 12,
    tiers: [
      { minQty: 15, price: 63.99 },
      { minQty: 60, price: 55.99 },
      { minQty: 150, price: 47.99 },
    ],
  },
  // Floral Summer Dress
  3: {
    moq: 10,
    unitsPerCarton: 20,
    gstSlab: 12,
    tiers: [
      { minQty: 10, price: 47.99 },
      { minQty: 50, price: 41.99 },
      { minQty: 100, price: 35.99 },
    ],
  },
  // Leather Crossbody Bag
  4: {
    moq: 10,
    unitsPerCarton: 15,
    gstSlab: 18,
    tiers: [
      { minQty: 10, price: 71.99 },
      { minQty: 40, price: 62.99 },
      { minQty: 100, price: 53.99 },
    ],
  },
  // Casual Canvas Sneakers
  5: {
    moq: 20,
    unitsPerCarton: 40,
    gstSlab: 12,
    tiers: [
      { minQty: 20, price: 31.99 },
      { minQty: 80, price: 27.99 },
      { minQty: 200, price: 23.99 },
    ],
  },
  // Default values for other product IDs (6-20)
  default: (price, id) => {
    const basePrice = price || 50;
    const isHighValue = basePrice > 100;
    const moq = isHighValue ? 5 : 20;
    const unitsPerCarton = isHighValue ? 10 : 50;
    const gstSlab = basePrice > 150 ? 18 : 12;

    return {
      moq,
      unitsPerCarton,
      gstSlab,
      tiers: [
        { minQty: moq, price: Math.round(basePrice * 0.8 * 100) / 100 },
        { minQty: moq * 4, price: Math.round(basePrice * 0.7 * 100) / 100 },
        { minQty: moq * 10, price: Math.round(basePrice * 0.6 * 100) / 100 },
      ],
    };
  },
};

/**
 * Get specs for a product
 */
export const getB2bProductSpecs = (productId, retailPrice) => {
  const specs = b2bProductSpecs[productId];
  if (specs) return specs;
  return b2bProductSpecs.default(retailPrice, productId);
};
