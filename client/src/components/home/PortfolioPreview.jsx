import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { OptimizedLazyImage } from '../ui/lazy-image';
import { useCMS } from '../../hooks/useCMS';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

export default function PortfolioPreview() {
  const { products } = useCMS();

  return (
    <section className="pt-4 pb-12 px-4 bg-app-bg relative overflow-hidden" id="portfolio">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3"
          >
            <span className="w-6 h-[2px] bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
              Featured Picks
            </span>
            <span className="w-6 h-[2px] bg-primary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black font-heading text-app-text"
          >
            Curated <span className="text-primary">Collections</span>
          </motion.h2>
        </div>

        {/* Product Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, idx) => (
              <motion.div
                key={product.id || idx}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-[300px] w-full relative cursor-pointer group"
              >
                <div className="h-full rounded-2xl border border-app-border/60 bg-white dark:bg-app-card/50 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(215,25,32,0.15)]">
                  
                  {/* Image Visual */}
                  <div className="relative w-full h-[180px] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {product.image && (
                      <OptimizedLazyImage 
                        src={product.image}
                        alt={`${product.name}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        placeholderColor="rgba(215,25,32,0.03)"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-slate-950/90 border border-primary/40 rounded px-2 py-0.5 text-[8px] font-extrabold text-primary uppercase tracking-wider shadow-sm">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 text-left flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm font-black font-heading text-app-text tracking-tight line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-black text-primary mt-1">
                        {product.price}
                      </p>
                    </div>
                    
                    {/* Link */}
                    <div className="border-t border-app-border/30 pt-3 mt-2 flex items-center justify-between">
                      <a
                        href={product.link || '#'}
                        className="relative inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-app-text hover:text-primary transition-colors"
                      >
                        <ShoppingBag size={12} className="text-primary" />
                        <span>View Product</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(215,25,32,0.2)] hover:shadow-[0_0_30px_rgba(215,25,32,0.4)]"
          >
            View All Products
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
