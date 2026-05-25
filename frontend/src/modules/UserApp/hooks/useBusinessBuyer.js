import { useB2bStore } from '../../../shared/store/b2bStore';
import { getB2bProductSpecs } from '../data/b2bMockData';

export const useBusinessBuyer = () => {
  const userRole = useB2bStore((state) => state.userRole);
  const setUserRole = useB2bStore((state) => state.setUserRole);
  const businessProfile = useB2bStore((state) => state.businessProfile);
  const quotations = useB2bStore((state) => state.quotations);
  const addQuotation = useB2bStore((state) => state.addQuotation);
  const updateBusinessProfile = useB2bStore((state) => state.updateBusinessProfile);
  const resetB2b = useB2bStore((state) => state.resetB2b);

  const isBusiness = userRole === 'business_buyer';

  /**
   * Get B2B specifications for a given product
   */
  const getWholesaleSpecs = (productId, retailPrice) => {
    return getB2bProductSpecs(productId, retailPrice);
  };

  /**
   * Get the applicable wholesale unit price based on ordered quantity
   */
  const getWholesalePriceForQty = (productId, retailPrice, qty) => {
    const specs = getWholesaleSpecs(productId, retailPrice);
    let applicablePrice = retailPrice;

    // Iterate through tiers to find the highest matching minimum quantity
    let matchedPrice = null;
    for (const tier of specs.tiers) {
      if (qty >= tier.minQty) {
        matchedPrice = tier.price;
      }
    }

    if (matchedPrice !== null) {
      return matchedPrice;
    }

    // Default to the first tier's price if they ask for B2B price view
    return specs.tiers[0]?.price || retailPrice * 0.8;
  };

  /**
   * Check if quantity meets MOQ requirement
   */
  const meetsMOQ = (productId, retailPrice, qty) => {
    const specs = getWholesaleSpecs(productId, retailPrice);
    return qty >= specs.moq;
  };

  return {
    userRole,
    setUserRole,
    isBusiness,
    businessProfile,
    quotations,
    addQuotation,
    updateBusinessProfile,
    resetB2b,
    getWholesaleSpecs,
    getWholesalePriceForQty,
    meetsMOQ,
  };
};
