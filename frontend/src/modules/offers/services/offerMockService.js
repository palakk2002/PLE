import { initialOffers } from "../data/mockOffers";

const STORAGE_KEY = "ple_offers_data_v2";
const EVENT_NAME = "ple_offers_update";

// Helper to initialize storage
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOffers));
  }
};

// Dispatch a custom event to notify React hooks of changes
const notifyListeners = () => {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const offerMockService = {
  subscribe(callback) {
    window.addEventListener(EVENT_NAME, callback);
    return () => window.removeEventListener(EVENT_NAME, callback);
  },

  getAllOffers() {
    initializeStorage();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Error reading offers from localStorage:", e);
      return [];
    }
  },

  getOfferById(id) {
    const offers = this.getAllOffers();
    return offers.find(o => o.id === id) || null;
  },

  createOffer(offerData) {
    initializeStorage();
    const offers = this.getAllOffers();
    const parseProductVal = val => {
      const num = Number(val);
      return isNaN(num) ? String(val).trim() : num;
    };
    const newOffer = {
      ...offerData,
      id: offerData.id || `offer_${Date.now()}`,
      isActive: offerData.isActive !== undefined ? offerData.isActive : true,
      priority: Number(offerData.priority) || 1,
      discountValue: Number(offerData.discountValue) || 0,
      applicableProducts: Array.isArray(offerData.applicableProducts) ? offerData.applicableProducts.map(parseProductVal) : [],
      applicableCategories: Array.isArray(offerData.applicableCategories) ? offerData.applicableCategories.map(Number) : []
    };

    offers.push(newOffer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
    notifyListeners();
    return newOffer;
  },

  updateOffer(id, updatedData) {
    initializeStorage();
    let offers = this.getAllOffers();
    let updatedOffer = null;
    const parseProductVal = val => {
      const num = Number(val);
      return isNaN(num) ? String(val).trim() : num;
    };

    offers = offers.map(o => {
      if (o.id === id) {
        updatedOffer = {
          ...o,
          ...updatedData,
          priority: updatedData.priority !== undefined ? Number(updatedData.priority) : o.priority,
          discountValue: updatedData.discountValue !== undefined ? Number(updatedData.discountValue) : o.discountValue,
          applicableProducts: Array.isArray(updatedData.applicableProducts) ? updatedData.applicableProducts.map(parseProductVal) : o.applicableProducts,
          applicableCategories: Array.isArray(updatedData.applicableCategories) ? updatedData.applicableCategories.map(Number) : o.applicableCategories
        };
        return updatedOffer;
      }
      return o;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
    notifyListeners();
    return updatedOffer;
  },

  deleteOffer(id) {
    initializeStorage();
    let offers = this.getAllOffers();
    const initialLength = offers.length;
    offers = offers.filter(o => o.id !== id);

    if (offers.length !== initialLength) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
      notifyListeners();
      return true;
    }
    return false;
  },

  toggleOfferStatus(id) {
    const offer = this.getOfferById(id);
    if (offer) {
      const newStatus = !offer.isActive;
      this.updateOffer(id, { isActive: newStatus });
      return newStatus;
    }
    return false;
  },

  getOffersByCreator(creatorType, creatorName = null) {
    const offers = this.getAllOffers();
    return offers.filter(o => {
      const typeMatch = o.creatorType === creatorType;
      if (creatorName) {
        return typeMatch && o.createdBy === creatorName;
      }
      return typeMatch;
    });
  },

  getOffersForProduct(productId, categoryId = null) {
    const offers = this.getAllOffers().filter(o => o.isActive && o.status === "Active");
    const prodIdStr = (productId !== null && productId !== undefined) ? String(productId).trim() : "";
    const catIdStr = (categoryId !== null && categoryId !== undefined) ? String(categoryId).trim() : "";

    return offers.filter(o => {
      // Check if specifically mapped to product
      const appProds = Array.isArray(o.applicableProducts) ? o.applicableProducts.map(String) : [];
      if (appProds.includes(prodIdStr)) {
        return true;
      }

      // If the offer is specifically for other products, it does not apply to this one
      const hasSpecificProducts = appProds.length > 0;
      if (hasSpecificProducts) {
        return false;
      }

      // Check if applicable to product's category
      const appCats = Array.isArray(o.applicableCategories) ? o.applicableCategories.map(String) : [];
      const hasCategories = appCats.length > 0;

      if (hasCategories && catIdStr && appCats.includes(catIdStr)) {
        return true;
      }

      // Check for general storewide offer fallback (no specific products/categories OR covers all categories 1-6)
      const isSiteWide = hasCategories && ["1", "2", "3", "4", "5", "6"].every(c => appCats.includes(c));
      if (!hasSpecificProducts && (!hasCategories || isSiteWide)) {
        return true;
      }

      return false;
    });
  },

  getOffersForCategory(categoryId) {
    const offers = this.getAllOffers().filter(o => o.isActive && o.status === "Active");
    const cid = Number(categoryId);

    return offers.filter(o => {
      return Array.isArray(o.applicableCategories) && o.applicableCategories.includes(cid);
    });
  }
};
