import { create } from 'zustand';
import api from '../../../shared/utils/api';
import { LANDING_PAGE_DEFAULTS } from '../data/landingPageDefaults';

export const useLandingPageStore = create(
  (set, get) => ({
    ...LANDING_PAGE_DEFAULTS,

    saveToBackend: async () => {
      try {
        const state = get();
        const { sections, hero, services, whyChooseUs, comparison, stats, testimonials, products, pricing, gallery, presenceMap, ctaBanner, faq, contact, social, footer, seo, blogs, adLandingPages } = state;
        const payload = { sections, hero, services, whyChooseUs, comparison, stats, testimonials, products, pricing, gallery, presenceMap, ctaBanner, faq, contact, social, footer, seo, blogs, adLandingPages };
        await api.put('/admin/settings/landingPageCms', { value: payload });
        return true;
      } catch (error) {
        console.error("Failed to save landing page CMS to backend:", error);
        throw error;
      }
    },

    fetchInitialData: async () => {
      try {
        const response = await api.get('/settings/landingPageCms');
        let payload = response?.data?.data || response?.data;
        // Auto-heal legacy nested data from previous bug
        if (payload && payload.value && !payload.hero) {
          payload = payload.value;
        }
        if (payload && Object.keys(payload).length > 0) {
          set((state) => ({ ...state, ...payload }));
        }
      } catch (error) {
        console.error("Failed to fetch landing page CMS from backend:", error);
      }
    },

    // Actions
    updateSectionVisibility: (sectionId, visible) => {
      set((state) => ({
        sections: state.sections.map((sec) =>
          sec.id === sectionId ? { ...sec, visible } : sec
        ),
      }));
      get().saveToBackend();
    },

    updateSectionsOrder: (newSections) => {
      set({ sections: newSections });
      get().saveToBackend();
    },

    updateHero: (data) => {
      set((state) => ({ hero: { ...state.hero, ...data } }));
      get().saveToBackend();
    },

    updateServices: (services) => {
      set({ services });
      get().saveToBackend();
    },
    
    updateWhyChooseUs: (whyChooseUs) => {
      set({ whyChooseUs });
      get().saveToBackend();
    },

    updateComparison: async (data) => {
      set((state) => ({ comparison: { ...state.comparison, ...data } }));
      await get().saveToBackend();
    },

    updateStats: (stats) => {
      set({ stats });
      get().saveToBackend();
    },

    updateTestimonials: (testimonials) => {
      set({ testimonials });
      get().saveToBackend();
    },

    updateProducts: (products) => {
      set({ products });
      get().saveToBackend();
    },

    updatePricing: (pricing) => {
      set({ pricing });
      get().saveToBackend();
    },

    updateGallery: (gallery) => {
      set({ gallery });
      get().saveToBackend();
    },

    updatePresenceMap: (data) => {
      set((state) => ({ presenceMap: { ...state.presenceMap, ...data } }));
      get().saveToBackend();
    },

    updateCtaBanner: (data) => {
      set((state) => ({ ctaBanner: { ...state.ctaBanner, ...data } }));
      get().saveToBackend();
    },

    updateFaq: (faq) => {
      set({ faq });
      get().saveToBackend();
    },

    updateContact: (data) => {
      set((state) => ({ contact: { ...state.contact, ...data } }));
      get().saveToBackend();
    },

    updateSocial: (data) => {
      set((state) => ({ social: { ...state.social, ...data } }));
      get().saveToBackend();
    },

    updateFooter: (data) => {
      set((state) => ({ footer: { ...state.footer, ...data } }));
      get().saveToBackend();
    },

    updateSeo: (data) => {
      set((state) => ({ seo: { ...state.seo, ...data } }));
      get().saveToBackend();
    },

    updateBlogs: (blogs) => {
      set({ blogs });
      get().saveToBackend();
    },

    updateAdLandingPages: (data) => {
      set((state) => ({ adLandingPages: { ...state.adLandingPages, ...data } }));
      get().saveToBackend();
    },

    resetToDefaults: () => {
      set(LANDING_PAGE_DEFAULTS);
      get().saveToBackend();
    },
  })
);
