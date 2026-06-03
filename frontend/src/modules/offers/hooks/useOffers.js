import { useState, useEffect, useCallback } from "react";
import { offerMockService } from "../services/offerMockService";
import { CREATOR_TYPES, OFFER_STATUS } from "../constants/offerTypes";

export const useOffers = (options = {}) => {
  const { creatorType, creatorName, productId, categoryId } = options;
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshOffers = useCallback(() => {
    setIsLoading(true);
    let data = [];
    if (creatorType) {
      data = offerMockService.getOffersByCreator(creatorType, creatorName);
    } else if (productId) {
      data = offerMockService.getOffersForProduct(productId, categoryId);
    } else if (categoryId) {
      data = offerMockService.getOffersForCategory(categoryId);
    } else {
      data = offerMockService.getAllOffers();
    }
    setOffers(data);
    setIsLoading(false);
  }, [creatorType, creatorName, productId, categoryId]);

  useEffect(() => {
    refreshOffers();
    // Subscribe to updates from other pages/components
    const unsubscribe = offerMockService.subscribe(() => {
      refreshOffers();
    });
    return () => unsubscribe();
  }, [refreshOffers]);

  const createOffer = (offerData) => {
    const res = offerMockService.createOffer(offerData);
    refreshOffers();
    return res;
  };

  const updateOffer = (id, updatedData) => {
    const res = offerMockService.updateOffer(id, updatedData);
    refreshOffers();
    return res;
  };

  const deleteOffer = (id) => {
    const res = offerMockService.deleteOffer(id);
    refreshOffers();
    return res;
  };

  const toggleOfferStatus = (id) => {
    const res = offerMockService.toggleOfferStatus(id);
    refreshOffers();
    return res;
  };

  // Compute dashboard metrics
  const getDashboardStats = () => {
    const all = offerMockService.getAllOffers();
    const active = all.filter(o => o.isActive && o.status === OFFER_STATUS.ACTIVE);
    const expired = all.filter(o => o.status === OFFER_STATUS.EXPIRED);
    const scheduled = all.filter(o => o.status === OFFER_STATUS.SCHEDULED);
    const adminOffers = all.filter(o => o.creatorType === CREATOR_TYPES.ADMIN);
    const sellerOffers = all.filter(o => o.creatorType === CREATOR_TYPES.SELLER);

    return {
      total: all.length,
      active: active.length,
      expired: expired.length,
      scheduled: scheduled.length,
      admin: adminOffers.length,
      seller: sellerOffers.length
    };
  };

  // Compute seller dashboard metrics
  const getSellerDashboardStats = (sellerName) => {
    const all = offerMockService.getOffersByCreator(CREATOR_TYPES.SELLER, sellerName);
    const active = all.filter(o => o.isActive && o.status === OFFER_STATUS.ACTIVE);
    const expired = all.filter(o => o.status === OFFER_STATUS.EXPIRED);
    const scheduled = all.filter(o => o.status === OFFER_STATUS.SCHEDULED);

    return {
      total: all.length,
      active: active.length,
      expired: expired.length,
      scheduled: scheduled.length
    };
  };

  return {
    offers,
    isLoading,
    refreshOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    getDashboardStats,
    getSellerDashboardStats
  };
};
export default useOffers;
