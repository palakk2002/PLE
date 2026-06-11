import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LANDING_PAGE_DEFAULTS } from '../data/landingPageDefaults';

export const useLandingPageStore = create(
  persist(
    (set) => ({
      ...LANDING_PAGE_DEFAULTS,

      // Actions
      updateSectionVisibility: (sectionId, visible) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, visible } : sec
          ),
        })),

      updateSectionsOrder: (newSections) =>
        set({ sections: newSections }),

      updateHero: (data) =>
        set((state) => ({ hero: { ...state.hero, ...data } })),

      updateServices: (services) => set({ services }),
      
      updateWhyChooseUs: (whyChooseUs) => set({ whyChooseUs }),

      updateComparison: (data) =>
        set((state) => ({ comparison: { ...state.comparison, ...data } })),

      updateStats: (stats) => set({ stats }),

      updateTestimonials: (testimonials) => set({ testimonials }),

      updateProducts: (products) => set({ products }),

      updatePricing: (pricing) => set({ pricing }),

      updateGallery: (gallery) => set({ gallery }),

      updatePresenceMap: (data) =>
        set((state) => ({ presenceMap: { ...state.presenceMap, ...data } })),

      updateCtaBanner: (data) =>
        set((state) => ({ ctaBanner: { ...state.ctaBanner, ...data } })),

      updateFaq: (faq) => set({ faq }),

      updateContact: (data) =>
        set((state) => ({ contact: { ...state.contact, ...data } })),

      updateSocial: (data) =>
        set((state) => ({ social: { ...state.social, ...data } })),

      updateFooter: (data) =>
        set((state) => ({ footer: { ...state.footer, ...data } })),

      updateSeo: (data) =>
        set((state) => ({ seo: { ...state.seo, ...data } })),

      updateBlogs: (blogs) => set({ blogs }),

      updateAdLandingPages: (data) =>
        set((state) => ({ adLandingPages: { ...state.adLandingPages, ...data } })),

      resetToDefaults: () => set(LANDING_PAGE_DEFAULTS),
    }),
    {
      name: 'ple-landing-page-cms-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
