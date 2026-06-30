import { create } from 'zustand';
import { getAboutContent, updateAboutContent } from '../services/adminService';

const ABOUT_PAGE_DEFAULTS = {
    hero: {
        title: 'Shopping Made Simple',
        subtitle: 'Powered by Trust & Convenience',
        description: 'PLE (Peoples League of Electronics) is a customer-first shopping app built to bring electronics, fashion, home essentials, beauty, wellness, sports, and daily needs into one smooth marketplace.',
        secureStatValue: '99%',
        secureStatLabel1: 'Secure',
        secureStatLabel2: 'Checkout',
        categoryStatValue: '25+',
        categoryStatLabel1: 'Product',
        categoryStatLabel2: 'Categories',
        teamImg: '/sho5.jpg'
    },
    aboutCompany: {
        title1: 'Helping People Shop',
        title2: 'With Better Deals & Trusted Sellers',
        paragraphs: [
            "At **PLE (Peoples League of Electronics)**, we believe technology isn't just about code — it's about creating meaningful impact.",
            "We are a **next-generation shopping marketplace** helping customers discover quality products, compare better deals, and buy from trusted sellers with secure checkout.",
            "Founded with a vision to **bring everyday shopping into one reliable app**, PLE connects shoppers with electronics, lifestyle, home, wellness, sports, and essential products.",
            "Our team works to make product discovery, payments, delivery updates, returns, and support smoother from the first search to the final doorstep delivery."
        ],
        features: [
            { title: 'Trusted Shopping', description: 'Secure checkout, verified seller listings, and clear product information.', iconName: 'ShieldCheck' },
            { title: 'Customer Value', description: 'Daily deals, easy returns, and helpful support for a better shopping journey.', iconName: 'AwardIcon' }
        ],
        founderName: 'Rakesh Kumar',
        founderRole: 'Founder, PLE Shopping Marketplace',
        compImg1: '/sho1.jpg',
        compImg2: '/sho.jpg',
        yearsOfExcellence: '5+'
    },
    whatWeDo: {
        title: 'Everything A Shopping App Needs',
        description: 'PLE (Peoples League of Electronics) brings product discovery, trusted sellers, secure payments, delivery updates, deals, and support together in one shopping app.',
        services: [
            { title: 'Smart Shopping Experience', description: 'A fast, mobile-friendly shopping journey built for browsing, comparing, saving, and checking out with confidence.', icon: 'Code' },
            { title: 'Curated Product Categories', description: 'Electronics, fashion, home, beauty, wellness, sports, and daily essentials organized for quick discovery.', icon: 'Share2' },
            { title: 'Deals & Savings', description: 'Daily offers, seasonal drops, bundle savings, and clear pricing so shoppers can find better value faster.', icon: 'Megaphone' },
            { title: 'Verified Sellers', description: 'Trusted seller listings, product clarity, ratings, and transparent details for a safer marketplace experience.', icon: 'Palette' },
            { title: 'Secure Payments', description: 'Protected checkout flows and clear order confirmation designed to make every purchase feel safe.', icon: 'Calculator' },
            { title: 'Order Tracking', description: 'Simple delivery updates from cart to doorstep, with support when an order needs extra attention.', icon: 'BarChart3' },
            { title: 'Easy Returns & Support', description: 'Clear return guidance and helpful customer support for payments, delivery, product issues, and replacements.', icon: 'Cpu' }
        ]
    },
    vision: {
        title: 'Make Everyday Shopping Easier',
        description: 'To become a trusted shopping app where customers can discover quality products, compare better deals, and shop confidently from verified sellers.'
    },
    mission: {
        title: 'Bringing Value To Every Cart',
        description: 'To make online shopping faster, safer, and more transparent through curated categories, secure payments, delivery updates, easy returns, and helpful support.'
    },
    ourEdge: {
        title: 'Why Shoppers Trust PLE (Peoples League of Electronics)',
        description: 'We make shopping simpler by combining curated products, verified sellers, clear pricing, secure checkout, and reliable support under one marketplace.',
        steps: [
            { step: '01', title: 'Curated Categories', description: 'Shop electronics, fashion, home, beauty, wellness, sports, and essentials in one app.' },
            { step: '02', title: 'Verified Sellers', description: 'Clear product listings, trusted seller information, and transparent buying details.' },
            { step: '03', title: 'Secure Checkout', description: 'Protected payments, order confirmation, and smooth tracking after purchase.' },
            { step: '04', title: 'Easy Support', description: 'Helpful assistance for delivery updates, returns, replacements, and order questions.' }
        ]
    }
};

export const useAboutPageStore = create((set, get) => ({
    ...ABOUT_PAGE_DEFAULTS,
    isLoading: false,

    fetchInitialData: async () => {
        set({ isLoading: true });
        try {
            const response = await getAboutContent();
            if (response?.data?.data) {
                const fetchedData = response.data.data;
                // Merge with defaults to ensure all nested objects exist
                set((state) => ({
                    ...state,
                    ...fetchedData,
                    hero: { ...ABOUT_PAGE_DEFAULTS.hero, ...(fetchedData.hero || {}) },
                    aboutCompany: { ...ABOUT_PAGE_DEFAULTS.aboutCompany, ...(fetchedData.aboutCompany || {}) },
                    whatWeDo: { ...ABOUT_PAGE_DEFAULTS.whatWeDo, ...(fetchedData.whatWeDo || {}) },
                    vision: { ...ABOUT_PAGE_DEFAULTS.vision, ...(fetchedData.vision || {}) },
                    mission: { ...ABOUT_PAGE_DEFAULTS.mission, ...(fetchedData.mission || {}) },
                    ourEdge: { ...ABOUT_PAGE_DEFAULTS.ourEdge, ...(fetchedData.ourEdge || {}) },
                }));
            }
        } catch (error) {
            console.error("Failed to fetch about page CMS from backend:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    saveToBackend: async () => {
        try {
            const state = get();
            const { hero, aboutCompany, whatWeDo, vision, mission, ourEdge } = state;
            const payload = { hero, aboutCompany, whatWeDo, vision, mission, ourEdge };
            await updateAboutContent(payload);
            return true;
        } catch (error) {
            console.error("Failed to save about page CMS to backend:", error);
            throw error;
        }
    },

    updateHero: (data) => {
        set((state) => ({ hero: { ...state.hero, ...data } }));
        get().saveToBackend();
    },

    updateAboutCompany: (data) => {
        set((state) => ({ aboutCompany: { ...state.aboutCompany, ...data } }));
        get().saveToBackend();
    },

    updateWhatWeDo: (data) => {
        set((state) => ({ whatWeDo: { ...state.whatWeDo, ...data } }));
        get().saveToBackend();
    },

    updateVision: (data) => {
        set((state) => ({ vision: { ...state.vision, ...data } }));
        get().saveToBackend();
    },

    updateMission: (data) => {
        set((state) => ({ mission: { ...state.mission, ...data } }));
        get().saveToBackend();
    },

    updateOurEdge: (data) => {
        set((state) => ({ ourEdge: { ...state.ourEdge, ...data } }));
        get().saveToBackend();
    }
}));
