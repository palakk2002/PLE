import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export default function LoyaltyRewards() {
  const { loyaltyRewards } = useCMS();

  if (!loyaltyRewards || !loyaltyRewards.status) return null;

  return (
    <section className="py-20 px-4 bg-app-bg relative overflow-hidden" id="loyalty">
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-client-primary/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Graphic/Illustration */}
          {loyaltyRewards.illustration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden border border-app-border/40 shadow-2xl group"
            >
              <img 
                src={loyaltyRewards.illustration} 
                alt="Loyalty program benefits" 
                className="w-full h-auto max-h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4 bg-client-primary text-black p-3 rounded-2xl shadow-xl flex items-center justify-center">
                <Award size={24} />
              </div>
            </motion.div>
          )}

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-2">
              <span className="text-client-primary text-xs font-black uppercase tracking-[0.2em]">Loyalty Rewards Program</span>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-app-text leading-tight">
                {loyaltyRewards.title}
              </h2>
            </div>
            
            <p className="text-app-text-muted leading-relaxed font-medium">
              {loyaltyRewards.description}
            </p>

            {/* Benefits list */}
            {loyaltyRewards.benefits && loyaltyRewards.benefits.length > 0 && (
              <div className="space-y-3 pt-2">
                {loyaltyRewards.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm font-semibold text-app-text">
                    <CheckCircle2 className="w-5 h-5 text-client-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {loyaltyRewards.ctaText && (
              <div className="pt-4">
                <a
                  href={loyaltyRewards.ctaLink || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-client-primary hover:bg-client-primary-hover text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(215,25,32,0.15)]"
                >
                  <span>{loyaltyRewards.ctaText}</span>
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
