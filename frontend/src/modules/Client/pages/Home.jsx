import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import CatalogueSection from '../components/home/Catalogue/CatalogueSection';
import ServicesPreview from '../components/home/ServicesPreview';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ComparisonTable from '../components/home/ComparisonTable';
import StatsCounter from '../components/home/StatsCounter';
import Testimonials from '../components/home/Testimonials';
import PortfolioPreview from '../components/home/PortfolioPreview';
import PresenceMap from '../components/home/PresenceMap';
import CTABanner from '../components/home/CTABanner';
import Gallery from '../components/home/Gallery';
import TrustedBrands from '../components/home/TrustedBrands';
import ProductCategories from '../components/home/ProductCategories';
import PortfolioHighlights from '../components/home/PortfolioHighlights';
import CPOSection from '../components/home/CPOSection';
import GPOSection from '../components/home/GPOSection';
import SmartDeals from '../components/home/SmartDeals';
import LoyaltyRewards from '../components/home/LoyaltyRewards';
import ZeroMaintenance from '../components/home/ZeroMaintenance';
import { useCMS } from '../hooks/useCMS';

export default function Home() {
  const { sections } = useCMS();

  // Mapping from section IDs to components
  const componentMap = {
    hero: <Hero key="hero" />,
    catalogue: <CatalogueSection key="catalogue" />,
    trustedBrands: <TrustedBrands key="trustedBrands" />,
    productCategories: <ProductCategories key="productCategories" />,
    portfolioHighlights: <PortfolioHighlights key="portfolioHighlights" />,
    cpoSection: <CPOSection key="cpoSection" />,
    gpoSection: <GPOSection key="gpoSection" />,
    smartDeals: <SmartDeals key="smartDeals" />,
    loyaltyRewards: <LoyaltyRewards key="loyaltyRewards" />,
    zeroMaintenance: <ZeroMaintenance key="zeroMaintenance" />,
    services: null,
    whyChooseUs: <WhyChooseUs key="whyChooseUs" />,
    comparison: <ComparisonTable key="comparison" />,
    stats: <StatsCounter key="stats" />,
    testimonials: <Testimonials key="testimonials" />,
    portfolio: <PortfolioPreview key="portfolio" />,
    gallery: <Gallery key="gallery" />,
    presenceMap: <PresenceMap key="presenceMap" />,
    ctaBanner: <CTABanner key="ctaBanner" />,
  };

  // Sort and filter visible sections, ensuring pricing is removed
  const visibleSections = [...sections]
    .sort((a, b) => a.order - b.order)
    .filter((sec) => sec.visible && sec.id !== 'pricing');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-app-bg text-app-text-muted min-h-screen relative"
    >
      {visibleSections.map((sec) => componentMap[sec.id] || null)}
    </motion.div>
  );
}


