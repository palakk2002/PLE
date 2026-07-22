import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Check, Award, Users, Play, Pause, Globe, Code, Cpu, Database } from 'lucide-react';
import heroImage from '../../assets/hero_modern.png';
import lightLogo from '../../assets/logo_Square.jpg__1_-removebg-preview.png';
import darkLogo from '../../assets/DarkthemeLogo.png';
const backgroundVideo = '/electronicsvideo.mp4';
import { useTheme } from '../../context/ThemeContext';
import { Spotlight } from '@/components/ui/spotlight';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { useCMS } from '../../hooks/useCMS';

const defaultPhrases = [
  'Electronics',
  'Fashion & Apparel',
  'Home & Living',
  'Beauty & Wellness',
  'Sports & Outdoors'
];

const FloatingIcon = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-15, 15, -15] }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    className={`absolute pointer-events-none opacity-20 ${className}`}
  >
    {children}
  </motion.div>
);

export default function Hero() {
  const { theme } = useTheme();
  const [textIndex, setTextIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  
  const { hero: cmsHero } = useCMS();
  const rotatingPhrases = cmsHero?.rotatingPhrases || defaultPhrases;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentTranslate = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Rotate text phrases every 4 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, rotatingPhrases]);

  const primaryLink = (cmsHero?.primaryBtnLink === '#pricing') ? '#smart-deals' : (cmsHero?.primaryBtnLink || '/get-quote');
  const secondaryLink = (cmsHero?.secondaryBtnLink === '#services') ? '/services' : (cmsHero?.secondaryBtnLink || '/services');

  const handleButtonClick = (e, targetLink) => {
    if (targetLink && targetLink.startsWith('#')) {
      const elementId = targetLink.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
      className="relative min-h-[50vh] md:min-h-[100vh] flex items-center pt-24 pb-4 md:pb-16 md:pt-28 overflow-hidden bg-app-bg"
    >
      {/* Full-Screen Video Background with Smooth Zoom */}
      <motion.div 
        style={{ scale: backgroundScale }}
        className="absolute inset-0 z-0 w-full h-full"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={cmsHero?.imageFallback || heroImage}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src={cmsHero?.videoBackground && cmsHero.videoBackground !== '/hero-video.mp4' 
              ? cmsHero.videoBackground 
              : backgroundVideo
            } 
            type="video/mp4" 
          />
        </video>
        {/* Advanced Overlay System */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/30 z-1" />
        <div className="absolute inset-0 bg-black/5 z-1" />
      </motion.div>

      {/* Floating Elements for Visual Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon delay={0} className="top-1/4 right-[10%] text-client-primary">
          <Globe size={48} strokeWidth={1} />
        </FloatingIcon>
        <FloatingIcon delay={2} className="bottom-1/3 left-[5%] text-client-primary">
          <Code size={40} strokeWidth={1} />
        </FloatingIcon>
        <FloatingIcon delay={1} className="top-1/3 left-[15%] text-client-primary">
          <Cpu size={32} strokeWidth={1} />
        </FloatingIcon>
        <FloatingIcon delay={3} className="bottom-1/4 right-[20%] text-client-primary">
          <Database size={36} strokeWidth={1} />
        </FloatingIcon>
      </div>

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <motion.div 
        style={{ opacity: contentOpacity, y: contentTranslate }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center min-h-[auto] sm:min-h-[60vh] md:min-h-[85vh]"
      >
        <div className="max-w-4xl w-full flex flex-col justify-center space-y-8 sm:space-y-10 text-left pt-8 pb-8 sm:py-0">
          {/* Tagline from Image - Fade in from Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-1"
          >
            <span className="text-[9.5px] sm:text-xs font-bold text-white/60 sm:text-app-text/50 tracking-[0.25em] sm:tracking-[0.4em] uppercase block mb-2 sm:mb-1">
              {cmsHero?.tagline || "REAL DEALS. FAST DELIVERY. HAPPY SHOPPING"}
            </span>
          </motion.div>

          <div className="space-y-5 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-7xl font-bold text-white font-heading tracking-tighter drop-shadow-2xl"
            >
              {cmsHero?.heading || (
                <>Shop. Save. Smile.<span className="text-client-primary">Enjoy.</span></>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl text-[13px] sm:text-base text-white/90 sm:text-client-primary font-medium leading-relaxed drop-shadow-md whitespace-pre-line"
            >
              {cmsHero?.subheading || "Discover daily deals, trusted sellers, and curated products across every category. Shop smart, checkout fast, and enjoy easy delivery."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto pt-2 sm:pt-0"
          >
            <Link
              to={primaryLink}
              onClick={(e) => handleButtonClick(e, primaryLink)}
              className="px-6 py-3.5 sm:px-10 sm:py-4 bg-client-primary hover:bg-client-primary-hover text-black font-black text-sm rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 group shadow-[0_0_30px_rgba(215,25,32,0.3)] w-full sm:w-auto text-center"
            >
              <span>{cmsHero?.primaryBtnText || "Shop Now"}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to={secondaryLink}
              onClick={(e) => handleButtonClick(e, secondaryLink)}
              className="px-6 py-3.5 sm:px-10 sm:py-4 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-client-primary hover:border-client-primary hover:text-black text-white font-bold text-sm rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center shadow-lg hover:shadow-[0_0_30px_rgba(215,25,32,0.3)]"
            >
              <span>{cmsHero?.secondaryBtnText || "Explore Products"}</span>
            </Link>
          </motion.div>

          {/* Additional Description Text below buttons */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl text-[11px] sm:text-sm text-white/50 sm:text-white/60 leading-relaxed sm:leading-relaxed font-medium tracking-wide mt-6 sm:mt-8 line-clamp-3 sm:line-clamp-none"
          >
            {cmsHero?.description || "Your everyday marketplace for electronics, fashion, home essentials, beauty, wellness, sports gear, and more. Compare offers, buy from verified sellers, pay securely, and get support from cart to doorstep."}
          </motion.p>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-client-primary/30 to-transparent z-10" />
    </section>
  );
}

