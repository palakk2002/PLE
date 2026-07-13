import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export default function PricingPreview() {
  const { pricing } = useCMS();

  return (
    <section className="pt-10 pb-12 px-4 bg-app-bg relative overflow-hidden" id="pricing">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-client-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black font-heading text-app-text tracking-tight"
          >
            Smart <span className="text-client-primary">Deals & Rewards</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-app-text-muted text-sm max-w-2xl mx-auto"
          >
            Pick the shopping value that fits your cart, from daily offers to faster delivery options.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricing.map((plan, index) => (
            <motion.div
              key={plan.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${
                plan.highlight 
                  ? 'border-client-primary shadow-[0_0_25px_rgba(215,25,32,0.15)] bg-app-card scale-100 lg:scale-105 z-10' 
                  : 'border-app-border hover:border-client-primary/50 bg-app-card'
              } border backdrop-blur-xl group`}
            >
              {/* Highlight Glow */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-client-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />

              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-client-primary text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-b-lg shadow-[0_4px_10px_rgba(215,25,32,0.3)] z-20">
                  Most Popular
                </div>
              )}

              <div className={`p-6 md:p-8 relative z-10 flex flex-col flex-grow ${plan.highlight ? 'pt-10' : ''}`}>
                <h3 className="text-xl font-bold text-app-text tracking-tight mb-2">{plan.title}</h3>
                <p className="text-app-text-muted text-sm mb-6 min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mb-6 flex items-baseline">
                  <span className="text-4xl font-black text-app-text tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-app-text-muted text-sm font-medium ml-1">{plan.period}</span>}
                </div>

                <div className="w-full h-px bg-app-border mb-6" />

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full p-0.5 shrink-0 ${plan.highlight ? 'bg-client-primary/20 text-client-primary' : 'bg-app-bg border border-app-border text-app-text-muted'}`}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-app-text-muted leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/products"
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${
                    plan.highlight 
                      ? 'bg-client-primary text-black hover:bg-app-text hover:text-app-bg shadow-[0_0_15px_rgba(215,25,32,0.3)]' 
                      : 'bg-app-bg text-app-text hover:border-client-primary border border-app-border'
                  }`}
                >
                  {plan.ctaText || 'Get Started'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


