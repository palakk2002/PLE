import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

// Fallback icon if the one provided is invalid
const FallbackIcon = LucideIcons.HelpCircle;

const Counter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const duration = 2000;
      
      // Attempt to extract numeric value from string (e.g., "15,000+" -> 15000)
      const cleanValue = typeof value === 'string' ? value.replace(/[^0-9]/g, '') : value;
      const finalValue = parseInt(cleanValue) || 0;

      if (finalValue === 0 && isNaN(parseInt(value))) {
        // If it's not a number at all (e.g., "24/7"), just set it directly to avoid animation glitches
        setCount(value);
        return;
      }

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeProgress * finalValue));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(finalValue);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  // If the value isn't purely numeric and can't be animated properly, just render the value
  const cleanValue = typeof value === 'string' ? value.replace(/[^0-9]/g, '') : value;
  const isPureText = isNaN(parseInt(cleanValue)) || cleanValue === '';
  
  return (
    <span ref={ref}>
      {isPureText ? value : count}{!isPureText ? suffix : ''}
    </span>
  );
};

export default function StatsCounter() {
  const { stats } = useCMS();

  return (
    <section className="py-8 px-4 relative z-10">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            // Note: Use a default icon since the CMS schema might not have an 'icon' field
            const IconComponent = LucideIcons[stat.icon] || LucideIcons.Activity || FallbackIcon;
            return (
              <motion.div 
                key={stat.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-app-card backdrop-blur-xl border border-slate-100 dark:border-app-border rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left justify-center sm:justify-start gap-2 sm:gap-4 group hover:border-primary transition-all duration-300 shadow-sm dark:shadow-xl relative overflow-hidden"
              >
                {/* Inner glass highlight */}
                <div className="absolute inset-0 border border-slate-200 dark:border-app-border rounded-xl sm:rounded-2xl pointer-events-none" />

                {/* Icon Box */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300 shrink-0 shadow-[0_0_15px_rgba(215,25,32,0.15)] relative z-10">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Text & Counter */}
                <div className="space-y-0.5 sm:space-y-1 relative z-10">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold font-heading text-primary transition-colors flex items-center justify-center sm:justify-start tracking-tight">
                    <Counter value={stat.value} suffix={stat.suffix || ''} />
                  </div>
                  <div className="text-slate-800 dark:text-app-text text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] sm:tracking-[0.15em] leading-tight px-1 sm:px-0">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
