import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export default function ZeroMaintenance() {
  const { zeroMaintenance } = useCMS();

  if (!zeroMaintenance || !zeroMaintenance.status) return null;

  return (
    <section className="py-20 px-4 bg-app-card/30 border-y border-app-border relative overflow-hidden" id="zero-maintenance">
      <div className="absolute inset-0 bg-client-primary/1 opacity-10 pointer-events-none -z-10" />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left order-2 md:order-1"
          >
            <div className="space-y-2">
              <span className="text-client-primary text-xs font-black uppercase tracking-[0.2em]">
                {zeroMaintenance.subtitle || 'Complete Support Agreement'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-app-text leading-tight">
                {zeroMaintenance.title}
              </h2>
            </div>
            
            <p className="text-app-text-muted leading-relaxed font-medium">
              {zeroMaintenance.description}
            </p>

            {/* Features list */}
            {zeroMaintenance.features && zeroMaintenance.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {zeroMaintenance.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-app-text">
                    <CheckCircle2 className="w-5 h-5 text-client-primary flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {zeroMaintenance.ctaText && (
              <div className="pt-4">
                <a
                  href={zeroMaintenance.ctaLink || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-client-primary hover:bg-client-primary-hover text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(215,25,32,0.15)]"
                >
                  <span>{zeroMaintenance.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>

          {/* Right Column - Image */}
          {zeroMaintenance.image && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden border border-app-border/40 shadow-2xl group order-1 md:order-2"
            >
              <img 
                src={zeroMaintenance.image} 
                alt={zeroMaintenance.title} 
                className="w-full h-auto max-h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-client-primary/10 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
