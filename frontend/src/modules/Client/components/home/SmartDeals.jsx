import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export default function SmartDeals() {
  const { smartDeals } = useCMS();

  if (!smartDeals || !smartDeals.status) return null;

  return (
    <section className="py-20 px-4 bg-app-card/20 border-y border-app-border relative overflow-hidden" id="smart-deals">
      <div className="absolute inset-0 bg-client-primary/1 opacity-10 pointer-events-none -z-10" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="w-6 h-[2px] bg-client-primary" />
            <span className="text-[10px] font-black text-client-primary uppercase tracking-[0.3em]">
              Priority Stock clearances
            </span>
            <span className="w-6 h-[2px] bg-client-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-heading text-app-text">
            {smartDeals.title}
          </h2>
          <p className="text-sm text-app-text-muted max-w-xl mx-auto">
            {smartDeals.description}
          </p>
        </div>

        {/* Promo Showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white dark:bg-app-card rounded-3xl border border-client-primary/20 p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8"
        >
          {smartDeals.banner && (
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <img src={smartDeals.banner} alt="Overlay Banner" className="w-full h-full object-cover filter blur-sm" />
            </div>
          )}

          {/* Left Column - Graphic/Image */}
          {smartDeals.image && (
            <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden border border-app-border/40 max-h-[300px]">
              <img src={smartDeals.image} alt={smartDeals.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-[#E53E3E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Tag size={12} /> Hot Offer
              </div>
            </div>
          )}

          {/* Right Column - Info */}
          <div className="w-full md:w-1/2 text-left space-y-6 relative z-10">
            <h3 className="text-2xl font-black text-client-primary leading-tight font-heading">
              {smartDeals.offerText}
            </h3>
            
            {smartDeals.expiry && (
              <div className="text-xs font-semibold text-app-text-muted uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-client-primary animate-ping inline-block" />
                Limited Offer Expiry: <span className="text-app-text font-black">{new Date(smartDeals.expiry).toLocaleDateString()}</span>
              </div>
            )}

            {smartDeals.buttonText && (
              <div className="pt-2">
                <a
                  href={smartDeals.buttonLink || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-client-primary hover:bg-client-primary-hover text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(215,25,32,0.15)]"
                >
                  <span>{smartDeals.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
