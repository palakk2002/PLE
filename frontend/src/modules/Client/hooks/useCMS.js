import { useState, useEffect } from 'react';
import api from '../services/api';

// Shared fallback defaults matching the CMS editor defaults
const FALLBACK_DEFAULTS = {
  sections: [
    { id: 'hero', name: 'Hero Section', visible: true, order: 0 },
    { id: 'services', name: 'Services / Categories', visible: true, order: 1 },
    { id: 'whyChooseUs', name: 'Features (Why Choose Us)', visible: true, order: 2 },
    { id: 'comparison', name: 'Comparison Table', visible: true, order: 3 },
    { id: 'stats', name: 'Stats Counter', visible: true, order: 4 },
    { id: 'testimonials', name: 'Testimonials', visible: true, order: 5 },
    { id: 'portfolio', name: 'Product Showcase', visible: true, order: 6 },
    { id: 'pricing', name: 'Deals & Rewards', visible: true, order: 7 },
    { id: 'gallery', name: 'Gallery', visible: true, order: 8 },
    { id: 'presenceMap', name: 'Presence Map', visible: true, order: 9 },
    { id: 'ctaBanner', name: 'CTA Banner', visible: true, order: 10 },
  ],
  hero: {
    tagline: 'REAL DEALS. FAST DELIVERY. HAPPY SHOPPING',
    heading: 'Shop. Save. Smile. Enjoy.',
    subheading: 'Get the best values on top brands. Curated marketplace with lightning-fast delivery and verified sellers.',
    description: 'Explore thousands of products across electronics, fashion, home essentials, and more. Experience shopping redefined.',
    primaryBtnText: 'Explore Deals',
    primaryBtnLink: '#pricing',
    secondaryBtnText: 'Our Services',
    secondaryBtnLink: '#services',
    rotatingPhrases: ['Electronics', 'Fashion', 'Home & Living', 'Groceries', 'Daily Deals', 'Verified Sellers'],
    videoBackground: '/hero-video.mp4',
    imageFallback: '/hero_modern.png',
  },
  services: [],
  whyChooseUs: [],
  comparison: {
    header: {
      heading: 'The Marketplace Advantage',
      description: 'Shop with more confidence, better value, and less friction.',
      vedhuntColumnHeader: 'Our Marketplace',
      typicalColumnHeader: 'Typical Store',
      bottomNote: 'Customer Shopping Experience Benchmarks 2026'
    },
    rows: []
  },
  stats: [],
  testimonials: [],
  products: [],
  pricing: [],
  gallery: [],
  presenceMap: {
    heading: 'Our Presence',
    description: '',
    locations: []
  },
  ctaBanner: {
    heading: 'Ready to elevate your business operations?',
    description: '',
    primaryBtnText: 'Get Free Estimate',
    primaryBtnLink: '#pricing',
    secondaryBtnText: 'Read Success Stories',
    secondaryBtnLink: '/portfolio'
  },
  faq: [],
  contact: {
    phone: '+91 86524 10289',
    phoneDisplay: '+91 86524 10289',
    email: 'support@ple.in',
    hours: 'Mon – Fri: 8:00am – 7:00pm',
    cin: 'CIN - U62099MH2025PTC447275',
    registration: 'Company Registration: CIN - U62099MH2025PTC447275',
    copyright: '© 2026 PLE (Peoples League of Electronics). All Rights Reserved.'
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  footer: {
    text: 'People’s League of Electronics (PLE) is a unified service ecosystem delivering next-generation digital products, high-yield growth marketing, and robust compliance management.',
    copyright: '© 2026 PLE. All Rights Reserved.'
  },
  seo: {
    metaTitle: 'PLE - Peoples League of Electronics',
    metaDescription: 'Unifying digital development, performance marketing, and business-focused finance services under one roof.',
    keywords: 'electronics, web development, app development, marketing, accounting'
  },
  blogs: [],
  adLandingPages: {}
};

export const useCMS = () => {
  const [cmsState, setCmsState] = useState(FALLBACK_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const response = await api.get('/settings/landingPageCms');
        let parsed = response?.data?.data || response?.data;
        
        // Auto-heal legacy nested data from previous bug
        if (parsed && parsed.value && !parsed.hero) {
          parsed = parsed.value;
        }

        if (parsed) {
          setCmsState((prev) => ({
            ...prev,
            ...parsed,
            // Fallback deep objects to prevent runtime errors
            hero: { ...prev.hero, ...parsed.hero },
            comparison: { ...prev.comparison, ...parsed.comparison },
            presenceMap: { ...prev.presenceMap, ...parsed.presenceMap },
            ctaBanner: { ...prev.ctaBanner, ...parsed.ctaBanner },
            contact: { ...prev.contact, ...parsed.contact },
            social: { ...prev.social, ...parsed.social },
            footer: { ...prev.footer, ...parsed.footer },
            seo: { ...prev.seo, ...parsed.seo },
          }));
        }
      } catch (e) {
        console.warn('Failed to fetch CMS data from backend, using defaults:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCMS();
  }, []);

  return { ...cmsState, loading };
};

