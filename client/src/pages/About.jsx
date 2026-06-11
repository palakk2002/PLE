import { motion } from 'framer-motion';
import { Check, ArrowRight, Code, Share2, Megaphone, Palette, Calculator, BarChart3, Cpu, Play, Tv } from 'lucide-react';
import { EncryptedText } from '@/components/ui/encrypted-text';

const teamImg = '/sho5.jpg';
const compImg1 = '/sho1.jpg';
const compImg2 = '/sho.jpg';
import { ShieldCheck, Award as AwardIcon } from 'lucide-react';

export default function About() {
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const scrollFadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const scrollFadeLeft = {
    hidden: { opacity: 0, x: -45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const scrollFadeRight = {
    hidden: { opacity: 0, x: 45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageReveal = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const whatWeDoServices = [
    {
      title: 'Smart Shopping Experience',
      desc: 'A fast, mobile-friendly shopping journey built for browsing, comparing, saving, and checking out with confidence.',
      icon: Code,
    },
    {
      title: 'Curated Product Categories',
      desc: 'Electronics, fashion, home, beauty, wellness, sports, and daily essentials organized for quick discovery.',
      icon: Share2,
    },
    {
      title: 'Deals & Savings',
      desc: 'Daily offers, seasonal drops, bundle savings, and clear pricing so shoppers can find better value faster.',
      icon: Megaphone,
    },
    {
      title: 'Verified Sellers',
      desc: 'Trusted seller listings, product clarity, ratings, and transparent details for a safer marketplace experience.',
      icon: Palette,
    },
    {
      title: 'Secure Payments',
      desc: 'Protected checkout flows and clear order confirmation designed to make every purchase feel safe.',
      icon: Calculator,
    },
    {
      title: 'Order Tracking',
      desc: 'Simple delivery updates from cart to doorstep, with support when an order needs extra attention.',
      icon: BarChart3,
    },
    {
      title: 'Easy Returns & Support',
      desc: 'Clear return guidance and helpful customer support for payments, delivery, product issues, and replacements.',
      icon: Cpu,
    }
  ];

  return (
    <div className="bg-app-bg text-app-text-muted min-h-screen pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 mesh-grid relative overflow-hidden">
      
      {/* Dynamic Floating Gradient Glow Backgrounds */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/8 rounded-full filter blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[450px] h-[450px] bg-primary/4 dark:bg-white/2 rounded-full filter blur-[150px] pointer-events-none" />
      
      {/* Floating Blur Circles */}
      <div className="absolute top-10 left-1/3 w-3 h-3 bg-primary/30 rounded-full filter blur-sm animate-bounce" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-primary/25 rounded-full filter blur-md animate-ping" style={{ animationDuration: '9s' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Hero Section Split Layout (Tolak inspired with Scroll triggers) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-28">
          
          {/* Left Column Content - Staggered scroll entry */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="lg:col-span-6 space-y-6 text-left"
          >
            
            {/* Tagline / Subtitle */}
            <motion.div variants={scrollFadeUp} className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-primary" />
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
                About PLE
              </span>
            </motion.div>

            {/* Bottom Text Reveal Title on scroll */}
            <h1 className="text-4xl md:text-5xl font-black font-heading text-app-text leading-tight tracking-tight flex flex-col gap-1.5">
              <EncryptedText 
                text="Shopping Made Simple" 
                revealedClassName="text-app-text"
                encryptedClassName="text-primary/60 font-mono"
                revealDelayMs={30}
              />
              <EncryptedText 
                text="Powered by Trust & Convenience" 
                revealedClassName="text-primary text-gradient-orange"
                encryptedClassName="text-primary/60 font-mono"
                revealDelayMs={20}
              />
            </h1>

            {/* Main Narrative paragraph on scroll */}
            <motion.p 
              variants={scrollFadeUp}
              className="text-xs md:text-sm text-app-text leading-relaxed"
            >
              PLE (Peoples League of Electronics) is a customer-first shopping app built to bring electronics, fashion, home essentials, beauty, wellness, sports, and daily needs into one smooth marketplace.
            </motion.p>

            {/* Structured Capabilities checklist on scroll */}
            <motion.div 
              variants={scrollFadeUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
            >
              {[
                'Curated Product Categories',
                'Verified Seller Listings',
                'Secure Payment Checkout',
                'Fast Delivery Updates',
                'Easy Returns Support',
                'Daily Deals & Rewards'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-app-text font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button Hover Animations */}
            <motion.div 
              variants={scrollFadeUp}
              className="pt-6"
            >
              <a
                href="https://ple-seven.vercel.app/register"
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(215,25,32,0.45)] group cursor-pointer overflow-hidden"
              >
                {/* Gloss slide overlay on hover */}
                <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </motion.div>

          </motion.div>

          {/* Right Column (Tolak curved rounded image design with Scroll animation) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="lg:col-span-6 flex items-center justify-center mt-12 lg:mt-0 px-4 sm:px-8 lg:px-0"
          >
            {/* Image & Decor Wrapper for perfect relative positioning */}
            <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square">
              
              {/* Curved absolute frame offset around circle */}
              <div className="absolute -top-4 -left-4 -bottom-4 -right-4 sm:-top-6 sm:-left-6 sm:-bottom-6 sm:-right-6 border-[2px] sm:border-[3px] border-dashed border-primary/30 rounded-full pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />

              {/* Glowing Accent Orb underneath circle */}
              <div className="absolute inset-0 rounded-full bg-primary/20 filter blur-xl sm:blur-2xl animate-pulse pointer-events-none" />

              {/* Large Circle image mask with robust orange stroke */}
              <motion.div 
                variants={imageReveal}
                className="relative w-full h-full rounded-full border-[6px] sm:border-[10px] border-primary overflow-hidden shadow-[0_20px_50px_rgba(215,25,32,0.25)] group transition-transform duration-500 hover:scale-[1.02] z-10"
              >
                <img
                  src={teamImg}
                  alt="PLE Creative Team"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Sleek warm dark brand-orange overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent pointer-events-none mix-blend-multiply" />
              </motion.div>

              {/* Floating Live Stat Bubble 1: Trust */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
                className="absolute top-4 -left-8 sm:top-10 sm:-left-12 bg-app-card backdrop-blur-md border border-app-border rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-2 sm:gap-3 orange-glow-sm hover:border-primary/40 transition-colors z-20"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs sm:text-sm">
                  99%
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-primary uppercase tracking-wider">Secure</p>
                  <p className="text-[11px] sm:text-xs font-black text-app-text">Checkout</p>
                </div>
              </motion.div>

              {/* Floating Live Stat Bubble 2: Categories */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.6 }}
                className="absolute bottom-4 -right-8 sm:bottom-10 sm:-right-12 bg-app-card backdrop-blur-md border border-app-border rounded-2xl p-3 sm:p-4 shadow-xl flex items-center gap-2 sm:gap-3 orange-glow-sm hover:border-primary/40 transition-colors z-20"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs sm:text-sm">
                  25+
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-primary uppercase tracking-wider">Product</p>
                  <p className="text-[11px] sm:text-xs font-black text-app-text">Categories</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* About Our Company Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-28 text-left">
          
          {/* Mobile First Heading Block (Order 1 on mobile, Top-Right on desktop) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="order-1 lg:col-span-6 lg:col-start-7 lg:row-start-1 space-y-6"
          >
            {/* Tagline / Subtitle */}
            <motion.div variants={scrollFadeUp} className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest">
                About Our Shopping App
              </span>
              <span className="w-8 h-[2px] bg-primary" />
            </motion.div>

            {/* Main Header with Scroll Encrypted Text Animation */}
            <motion.h2 
              variants={scrollFadeUp}
              className="text-3xl md:text-4xl font-black font-heading text-app-text leading-tight flex flex-col gap-1"
            >
              <EncryptedText 
                text="Helping People Shop" 
                revealedClassName="text-app-text"
                encryptedClassName="text-primary/60 font-mono"
                revealDelayMs={25}
              />
              <EncryptedText 
                text="With Better Deals & Trusted Sellers" 
                revealedClassName="text-primary text-gradient-orange"
                encryptedClassName="text-primary/60 font-mono"
                revealDelayMs={15}
              />
            </motion.h2>
          </motion.div>

          {/* Overlapping Offset Double Images (Order 2 on mobile, Left-spanning 2 rows on desktop) */}
          <div className="order-2 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:row-span-2 relative flex items-center justify-center min-h-[400px] sm:min-h-[480px] w-full self-center">
            
            {/* Fluid Flowing Wave & Halftone Dotted Layer Design (from reference image) */}
            <svg 
              className="absolute -left-16 lg:-left-24 top-1/2 -translate-y-1/2 w-[130%] h-[120%] pointer-events-none z-0 opacity-80 dark:opacity-25" 
              viewBox="0 0 600 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Halftone Dot Grid Pattern */}
                <pattern id="halftonePattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" className="fill-primary/20 dark:fill-primary/10" />
                </pattern>
                
                {/* Flowing Blue-to-Orange Linear Gradient for outlines */}
                <linearGradient id="waveLineGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D71920" stopOpacity="0.6" />
                </linearGradient>

                {/* Soft Gradient Mask for Halftone */}
                <linearGradient id="halftoneFade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D71920" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Halftone / Dotted Overlay Shape */}
              <path 
                d="M -20 100 Q 150 40, 220 220 T 480 300 L 480 480 L -20 480 Z" 
                fill="url(#halftonePattern)" 
                className="opacity-90 motion-safe:animate-pulse"
                style={{ animationDuration: '6s' }}
              />

              {/* Flowing Outlines & Bezier Curves */}
              <path 
                d="M -50 220 Q 120 80, 240 280 T 550 240" 
                stroke="url(#waveLineGrad)" 
                strokeWidth="5" 
                strokeLinecap="round" 
                fill="none"
              />
              
              <path 
                d="M -50 245 Q 120 105, 240 305 T 550 265" 
                stroke="url(#waveLineGrad)" 
                strokeWidth="1.5" 
                strokeDasharray="4 8"
                strokeLinecap="round" 
                fill="none"
                className="opacity-70"
              />

              <path 
                d="M -50 195 Q 120 55, 240 255 T 550 215" 
                stroke="#3B82F6" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none"
                className="opacity-40"
              />

              <path 
                d="M -50 220 Q 120 80, 240 280 T 550 240 L 550 500 L -50 500 Z" 
                fill="url(#halftoneFade)" 
                className="opacity-20"
              />
            </svg>
            
            {/* Base Double-Image Canvas */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center z-10">
              
              {/* Back Image (Offset Top-Left) */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={scrollFadeLeft}
                className="absolute top-0 left-0 w-[68%] aspect-[4/3] rounded-3xl overflow-hidden border-4 border-app-card shadow-2xl z-10 transition-all duration-300 group cursor-pointer"
              >
                <img 
                  src={compImg1} 
                  alt="PLE Engineering Team" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Front Image (Offset Bottom-Right) */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={scrollFadeRight}
                className="absolute bottom-0 right-0 w-[68%] aspect-[4/3] rounded-3xl overflow-hidden border-4 border-app-card shadow-2xl z-20 hover:z-30 transition-all duration-300 group cursor-pointer"
              >
                <img 
                  src={compImg2} 
                  alt="PLE Strategy Team" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Overlapping Central Badge (Transparent, Glassmorphic, and Animated Float) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.5 },
                    scale: { type: "spring", stiffness: 100 }
                  }}
                  viewport={{ once: true }}
                  className="glass-panel bg-app-card backdrop-blur-xl border border-app-border rounded-2xl p-6 shadow-[0_20px_50px_rgba(215,25,32,0.22)] flex flex-col items-center justify-center text-center w-36 h-36 orange-glow-sm hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="text-3xl md:text-4xl font-black text-primary font-heading leading-none">5+</div>
                  <div className="text-[9px] font-extrabold text-app-text uppercase tracking-widest mt-1">Years Of</div>
                  <div className="text-xs font-black text-app-text-muted">Excellence</div>
                </motion.div>
              </div>

            </div>
          </div>

          {/* Remaining Company Content Block (Order 3 on mobile, Bottom-Right on desktop) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="order-3 lg:col-span-6 lg:col-start-7 lg:row-start-2 space-y-6 lg:-mt-10"
          >
            {/* Core Description (Second Image text) */}
            <motion.div 
              variants={scrollFadeUp}
              className="space-y-4 text-xs md:text-sm text-app-text leading-relaxed"
            >
              <p>
                At <strong className="text-app-text font-black">PLE (Peoples League of Electronics)</strong>, we believe technology isn't just about code — it's about creating meaningful impact.
              </p>
              <p>
                We are a <strong className="text-primary font-bold">next-generation shopping marketplace</strong> helping customers discover quality products, compare better deals, and buy from trusted sellers with secure checkout.
              </p>
              <p>
                Founded with a vision to <strong className="text-app-text font-black">bring everyday shopping into one reliable app</strong>, PLE connects shoppers with electronics, lifestyle, home, wellness, sports, and essential products.
              </p>
              <p>
                Our team works to make product discovery, payments, delivery updates, returns, and support smoother from the first search to the final doorstep delivery.
              </p>
            </motion.div>

            {/* Checklist items (First image details) */}
            <motion.div 
              variants={scrollFadeUp} 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2"
            >
              <div className="flex items-start gap-3 group hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center shrink-0 orange-glow-sm group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs md:text-sm font-extrabold text-app-text font-heading group-hover:text-primary transition-colors duration-300">Trusted Shopping</h4>
                  <p className="text-[10px] md:text-xs text-app-text-muted leading-relaxed">
                    Secure checkout, verified seller listings, and clear product information.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center shrink-0 orange-glow-sm group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <AwardIcon className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs md:text-sm font-extrabold text-app-text font-heading group-hover:text-primary transition-colors duration-300">Customer Value</h4>
                  <p className="text-[10px] md:text-xs text-app-text-muted leading-relaxed">
                    Daily deals, easy returns, and helpful support for a better shopping journey.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Signature Badge Founder Detail */}
            <motion.div 
              variants={scrollFadeUp} 
              className="flex items-center justify-end gap-4 pt-6 border-t border-app-border/40"
            >

              <div className="text-right space-y-0.5">
                <h5 className="text-xs md:text-sm font-extrabold text-app-text font-heading">Rakesh Kumar</h5>
                <p className="text-[10px] md:text-xs text-app-text-muted">Founder, PLE Shopping Marketplace</p>
              </div>
            </motion.div>

          </motion.div>

        </div>



        {/* What We Do Section */}
        <div className="mb-16 md:mb-28 text-left space-y-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollFadeUp}
            className="max-w-3xl space-y-4"
          >
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-app-text leading-tight">
              Everything A Shopping App Needs
            </h2>
            <p className="text-xs md:text-sm text-app-text-muted leading-relaxed">
              PLE (Peoples League of Electronics) brings product discovery, trusted sellers, secure payments, delivery updates, deals, and support together in one shopping app.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {whatWeDoServices.map((service, idx) => {
              const ServiceIcon = service.icon;
              return (
                <motion.div 
                  key={idx} 
                  variants={scrollFadeUp}
                  className="glass-panel rounded-2xl p-6 bg-app-card border border-app-border shadow-md hover:shadow-xl hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                >
                  {/* Subtle orb background on hover */}
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/3 rounded-full filter blur-xl group-hover:bg-primary/6 transition-colors" />
                  
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 text-primary flex items-center justify-center orange-glow-sm group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <ServiceIcon className="w-5.5 h-5.5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm md:text-base font-extrabold text-app-text font-heading group-hover:text-primary transition-colors duration-200">
                        {service.title}
                      </h3>
                      <p className="text-[11px] md:text-xs text-app-text-muted leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Vision & Mission Section (Slide on scroll from edges with custom offset diagonal corner brackets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-16 md:mb-28">
          
          {/* Vision card - slides from left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollFadeLeft}
            className="glass-panel rounded-3xl p-6 md:p-10 text-left bg-app-card border border-app-border relative overflow-visible group hover:border-primary/30 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(215,25,32,0.06)]"
          >
            {/* Masked internal container for blur circle */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 rounded-full filter blur-2xl group-hover:bg-primary/10 transition-colors" />
            </div>

            {/* Premium Corner Brackets matching website branding theme (diagonal top-right and bottom-left layout) */}
            <div className="absolute -top-1.5 -right-1.5 w-8 h-8 md:w-12 md:h-12 border-t-[4px] border-r-[4px] border-primary rounded-tr-3xl pointer-events-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105" />
            <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 md:w-12 md:h-12 border-b-[4px] border-l-[4px] border-primary rounded-bl-3xl pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:scale-105" />

            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
              Our Vision
            </span>
            <h3 className="text-2xl font-black font-heading text-app-text mt-4 mb-3 leading-snug">
              Make Everyday Shopping Easier
            </h3>
            <p className="text-xs md:text-sm text-app-text-muted leading-relaxed">
              To become a trusted shopping app where customers can discover quality products, compare better deals, and shop confidently from verified sellers.
            </p>
          </motion.div>

          {/* Mission card - slides from right */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollFadeRight}
            className="glass-panel rounded-3xl p-6 md:p-10 text-left bg-app-card border border-app-border relative overflow-visible group hover:border-primary/30 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(215,25,32,0.06)]"
          >
            {/* Masked internal container for blur circle */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 rounded-full filter blur-2xl group-hover:bg-primary/10 transition-colors" />
            </div>

            {/* Premium Corner Brackets matching website branding theme (diagonal top-right and bottom-left layout) */}
            <div className="absolute -top-1.5 -right-1.5 w-8 h-8 md:w-12 md:h-12 border-t-[4px] border-r-[4px] border-primary rounded-tr-3xl pointer-events-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105" />
            <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 md:w-12 md:h-12 border-b-[4px] border-l-[4px] border-primary rounded-bl-3xl pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:scale-105" />

            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
              Our Mission
            </span>
            <h3 className="text-2xl font-black font-heading text-app-text mt-4 mb-3 leading-snug">
              Bringing Value To Every Cart
            </h3>
            <p className="text-xs md:text-sm text-app-text-muted leading-relaxed">
              To make online shopping faster, safer, and more transparent through curated categories, secure payments, delivery updates, easy returns, and helpful support.
            </p>
          </motion.div>

        </div>

        {/* Why Choose Us Block (Staggered items slide on scroll) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12 text-left">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollFadeLeft}
            className="lg:col-span-5 space-y-4"
          >
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
              Our Edge
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-heading text-app-text leading-tight">
              Why Shoppers Trust PLE (Peoples League of Electronics)
            </h2>
            <p className="text-xs text-app-text-muted leading-relaxed">
              We make shopping simpler by combining curated products, verified sellers, clear pricing, secure checkout, and reliable support under one marketplace.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="lg:col-span-7 flex flex-col relative w-full"
          >
            {[
              { step: '01', title: 'Curated Categories', desc: 'Shop electronics, fashion, home, beauty, wellness, sports, and essentials in one app.' },
              { step: '02', title: 'Verified Sellers', desc: 'Clear product listings, trusted seller information, and transparent buying details.' },
              { step: '03', title: 'Secure Checkout', desc: 'Protected payments, order confirmation, and smooth tracking after purchase.' },
              { step: '04', title: 'Easy Support', desc: 'Helpful assistance for delivery updates, returns, replacements, and order questions.' }
            ].map((box, bidx) => {
              // Staircase horizontal offsets for desktop, staggering left to use left-side space
              const mlClass = bidx === 0 ? 'lg:ml-72' : bidx === 1 ? 'lg:ml-48' : bidx === 2 ? 'lg:ml-24' : 'ml-0';
              const zIndexClass = bidx === 0 ? 'z-10' : bidx === 1 ? 'z-20' : bidx === 2 ? 'z-30' : 'z-40';
              
              return (
                <motion.div 
                  key={bidx} 
                  variants={scrollFadeUp}
                  className={`relative glass-panel bg-app-card backdrop-blur-md border border-app-border rounded-2xl p-4 md:p-5 shadow-lg hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:z-50 w-full max-w-[480px] ${mlClass} ${zIndexClass} group`}
                  style={{ 
                    marginTop: bidx > 0 ? '-20px' : '0px',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs md:text-sm font-extrabold text-app-text font-heading flex items-center gap-2 group-hover:text-primary transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{box.title}</span>
                      </h4>
                      <p className="text-[10px] md:text-[11px] text-app-text-muted leading-relaxed max-w-[380px]">
                        {box.desc}
                      </p>
                    </div>

                    {/* Step tag watermark */}
                    <div className="text-2xl font-black font-heading text-primary/10 select-none group-hover:text-primary/25 group-hover:scale-105 transition-all duration-300">
                      {box.step}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </div>
  );
}
