import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export default function CPOSection() {
  const { cpoSection } = useCMS();

  if (!cpoSection || !cpoSection.status) return null;

  return (
    <section className="py-20 px-4 bg-app-card/30 border-y border-app-border relative overflow-hidden" id="cpo">
      <div className="absolute inset-0 bg-client-primary/1 opacity-20 pointer-events-none -z-10" />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Image */}
          {cpoSection.image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden border border-app-border/40 shadow-2xl group"
            >
              <img 
                src={cpoSection.image} 
                alt={cpoSection.title} 
                className="w-full h-auto max-h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-client-primary/10 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-2">
              <span className="text-client-primary text-xs font-black uppercase tracking-[0.2em]">
                {cpoSection.subtitle || 'Certified Pre-Owned'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-app-text leading-tight">
                {cpoSection.title}
              </h2>
            </div>
            
            <p className="text-app-text-muted leading-relaxed font-medium">
              {cpoSection.description}
            </p>

            {/* Features list */}
            {cpoSection.features && cpoSection.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {cpoSection.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-app-text">
                    <CheckCircle2 className="w-5 h-5 text-client-primary flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {cpoSection.ctaText && (
              <div className="pt-4">
                <a
                  href={cpoSection.ctaLink || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-client-primary hover:bg-client-primary-hover text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(215,25,32,0.15)] hover:-translate-y-0.5"
                >
                  <span>{cpoSection.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
