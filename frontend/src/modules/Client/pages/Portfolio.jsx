import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CPOSection from '../components/home/CPOSection';
import GPOSection from '../components/home/GPOSection';
import TrustedBrands from '../components/home/TrustedBrands';
import { 
  Laptop, 
  Database, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Award,
  ArrowRight,
  Cpu,
  Monitor,
  Keyboard,
  Wifi,
  Printer,
  Smartphone,
  Gamepad2,
  Tv,
  ShieldAlert,
  Server,
  ShieldCheck,
  FileQuestion
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { EncryptedText } from '../components/ui/encrypted-text';
import { SpotlightHover } from '../components/ui/spotlight-hover';
import { Card } from '../components/ui/card';
import { useTheme } from '../context/ThemeContext';

// High-performance animated Counter that increments from 0 to target when scrolled into viewport
function CountUp({ to, duration = 1.8, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrameId;

    const runCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / (duration * 1000), 1);

      // Quadratic Ease-Out curve for realistic, elegant slowing down at the end
      const easeOutProgress = progress * (2 - progress);
      setCount(Math.floor(easeOutProgress * to));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(runCount);
      } else {
        setCount(to);
      }
    };

    animationFrameId = requestAnimationFrame(runCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, to, duration]);

  return (
    <span ref={ref} className="gpu-accelerated tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

const ICON_MAP = {
  Cpu,
  Laptop,
  Monitor,
  Database,
  Keyboard,
  Wifi,
  Printer,
  Zap,
  Smartphone,
  Gamepad2,
  Tv,
  ShieldAlert,
  Server,
  ShieldCheck,
  FileQuestion
};

const SOURCING_CATEGORIES = [
  {
    id: 'cat-1',
    title: "PC Components",
    subItems: ["Motherboards", "GPUs", "Cabinets", "SMPS", "Cooling", "RAM"],
    categoryGroup: "hardware",
    iconName: "Cpu",
    brands: ["ASUS ROG", "MSI", "Gigabyte", "Corsair", "Intel", "AMD", "NVIDIA", "G.Skill"],
    description: "Sourcing for high-performance processors, graphics accelerators, system memory, and chassis solutions."
  },
  {
    id: 'cat-2',
    title: "Laptops, Desktops & AIOs",
    subItems: ["Consumer Systems", "Commercial Systems", "Workstations"],
    categoryGroup: "hardware",
    iconName: "Laptop",
    brands: ["HP", "Dell", "Lenovo", "Apple", "Acer", "ASUS"],
    description: "Commercial and consumer computing solutions configured for enterprise scaling, office productivity, and remote setups."
  },
  {
    id: 'cat-3',
    title: "Monitors & Commercial Displays",
    subItems: ["Monitors", "Large-Format Displays", "Interactive Panels", "Video Walls"],
    categoryGroup: "av",
    iconName: "Monitor",
    brands: ["Samsung", "LG", "BenQ", "ViewSonic", "Dell"],
    description: "Pro-grade visual setups, high-resolution business monitors, collaborative touch panels, and signage systems."
  },
  {
    id: 'cat-4',
    title: "Storage & Memory",
    subItems: ["SSDs", "HDDs", "DRAM", "Memory Cards"],
    categoryGroup: "hardware",
    iconName: "Database",
    brands: ["Samsung", "Kingston", "Western Digital", "Crucial", "SanDisk"],
    description: "Reliable, high-density enterprise storage, solid-state system drives, and performance system memory packages."
  },
  {
    id: 'cat-5',
    title: "Peripherals & Accessories",
    subItems: ["Keyboards", "Mice", "Webcams", "Headphones", "Docks", "Bags", "Adapters"],
    categoryGroup: "hardware",
    iconName: "Keyboard",
    brands: ["Logitech", "HP", "Dell", "Lenovo", "Razer"],
    description: "Essential workstation additions, ergonomics, high-definition communication gear, and interface adaptors."
  },
  {
    id: 'cat-6',
    title: "Networking & Wi-Fi",
    subItems: ["Routers", "Switches", "Access Points", "FTTH", "SMB Networking"],
    categoryGroup: "network",
    iconName: "Wifi",
    brands: ["Cisco", "TP-Link", "Ubiquiti", "D-Link", "Netgear"],
    description: "High-capacity network distribution, enterprise security routing, managed switching, and fiber-to-the-home infrastructures."
  },
  {
    id: 'cat-7',
    title: "Printers, Copiers & Consumables",
    subItems: ["Printers", "Copiers", "Toners", "Cartridges", "Drums", "Accessories"],
    categoryGroup: "hardware",
    iconName: "Printer",
    brands: ["HP", "Canon", "Epson", "Brother", "Xerox"],
    description: "High-volume business copy systems, document scanners, and replacement toners or consumables."
  },
  {
    id: 'cat-8',
    title: "Power, UPS & Batteries",
    subItems: ["UPS Systems", "Backup Power", "Batteries"],
    categoryGroup: "hardware",
    iconName: "Zap",
    brands: ["APC", "Microtek", "Luminous", "Exide"],
    description: "Uninterrupted business continuity, surge protection, backup power generators, and long-life batteries."
  },
  {
    id: 'cat-9',
    title: "Mobile Phones & Tablets",
    subItems: ["Smartphones", "Tablets", "Mobility Devices"],
    categoryGroup: "hardware",
    iconName: "Smartphone",
    brands: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme"],
    description: "Handheld user devices, commercial tablets, mobile sales team setups, and specialized field gear."
  },
  {
    id: 'cat-10',
    title: "Gaming & Creator Products",
    subItems: ["Gaming Laptops", "GPUs", "Accessories", "Creator Tablets/Displays"],
    categoryGroup: "hardware",
    iconName: "Gamepad2",
    brands: ["ASUS ROG", "MSI", "Razer", "Wacom", "NVIDIA"],
    description: "High-end creative workspace infrastructure, stylus tablets, graphic design displays, and gaming configurations."
  },
  {
    id: 'cat-11',
    title: "Smart / Interactive & AV Solutions",
    subItems: ["Projectors", "Interactive Panels", "Conferencing Gear", "Commercial AV"],
    categoryGroup: "av",
    iconName: "Tv",
    brands: ["Epson", "BenQ", "Logitech", "Polycom", "Sony"],
    description: "Unified corporate conferencing systems, high-lumen projectors, and immersive acoustics."
  },
  {
    id: 'cat-12',
    title: "CCTV, Security & Surveillance",
    subItems: ["Security Cameras", "NVRs", "Smart Locks", "Intrusion Alarms"],
    categoryGroup: "network",
    iconName: "ShieldAlert",
    brands: ["Hikvision", "Dahua", "CP PLUS", "Honeywell"],
    description: "Active facility monitoring, digital security recording infrastructure, alarms, and smart physical locks."
  },
  {
    id: 'cat-13',
    title: "Enterprise, Cloud & Infrastructure",
    subItems: ["Servers", "Enterprise Hardware", "Business IT Requirements"],
    categoryGroup: "network",
    iconName: "Server",
    brands: ["Dell Technologies", "HPE", "Cisco", "Lenovo Enterprise"],
    description: "Scalable rack/tower servers, hyper-converged hardware systems, and automated cloud infrastructure."
  },
  {
    id: 'cat-14',
    title: "Software & Security",
    subItems: ["Antivirus", "Endpoint Security", "Operating Systems", "Software Licenses"],
    categoryGroup: "software",
    iconName: "ShieldCheck",
    brands: ["Microsoft", "Adobe", "Quick Heal", "Kaspersky", "Norton", "Red Hat"],
    description: "Productivity suites, virtualization platforms, business security antivirus, and enterprise software volume licensing."
  },
  {
    id: 'cat-15',
    title: "Custom Sourcing",
    subItems: ["Hard-to-Find Components", "Specialized Sourcing", "Product Not Listed"],
    categoryGroup: "custom",
    iconName: "FileQuestion",
    brands: ["Global OEM Sourcing"],
    description: "Tailored procurement channels for niche, customized, obsolete, or multi-brand hardware integrations."
  }
];

const BRAND_GROUPS = [
  {
    name: "Silicon & Components",
    list: ["Intel", "AMD", "NVIDIA", "ASUS", "Gigabyte", "MSI", "Corsair", "Kingston"]
  },
  {
    name: "Enterprise & Computing",
    list: ["HP", "Dell", "Lenovo", "Apple", "Cisco", "HPE", "Ubiquiti", "Netgear"]
  },
  {
    name: "Security, AV & Accessories",
    list: ["Hikvision", "CP PLUS", "Honeywell", "Dahua", "Epson", "BenQ", "Logitech", "Sony"]
  },
  {
    name: "Software & Operating Systems",
    list: ["Microsoft", "Adobe", "Quick Heal", "Kaspersky", "VMware", "Red Hat", "Norton", "Zoho"]
  }
];

export default function Portfolio() {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredCategories, setFilteredCategories] = useState(SOURCING_CATEGORIES);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredCategories(SOURCING_CATEGORIES);
    } else {
      setFilteredCategories(SOURCING_CATEGORIES.filter(cat => cat.categoryGroup === activeFilter));
    }
  }, [activeFilter]);

  // Animation definitions optimized for GPU hardware acceleration
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const scrollFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-app-bg text-app-text-muted min-h-screen pt-24 pb-8 sm:pt-28 sm:pb-12 px-4 sm:px-6 lg:px-8 mesh-grid relative overflow-hidden theme-transition">
      
      {/* Blended Glowing Orange Plexus Network Hero Background Image */}
      <div 
        className="absolute top-0 left-0 right-0 h-[450px] bg-cover bg-center opacity-[0.08] dark:opacity-[0.18] pointer-events-none mix-blend-color-burn dark:mix-blend-screen z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920')",
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          filter: 'hue-rotate(180deg) saturate(2.5) contrast(1.15)'
        }}
      />

      {/* Decorative Blur Ambient Orbs */}
      <div className="absolute top-1/4 -right-20 w-[300px] h-[300px] bg-client-primary/6 rounded-full filter blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[350px] h-[350px] bg-client-primary/3 dark:bg-white/1 rounded-full filter blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Compact Hero Segment with Increased Bottom Spacing */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-14 space-y-4"
        >
          {/* Subtitle Accent */}
          <motion.div variants={scrollFadeUp} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-client-primary/10 border border-client-primary/20 text-client-primary text-[10px] font-extrabold uppercase tracking-widest rounded-md">
            <Sparkles className="w-3 h-3" />
            <span>Unified B2B Electronics Sourcing Ecosystem</span>
          </motion.div>

          {/* Heading with Cryptographic Encryption Typing Reveal */}
          <h1 className="text-3xl md:text-5xl font-black font-heading text-app-text leading-tight tracking-tight flex flex-col gap-0.5">
            <EncryptedText 
              text="Our Sourcing" 
              revealedClassName="text-app-text"
              encryptedClassName="text-client-primary/50 font-mono"
              revealDelayMs={20}
            />
            <EncryptedText 
              text="Hardware & Software Catalog" 
              revealedClassName="text-client-primary text-gradient-orange"
              encryptedClassName="text-client-primary/50 font-mono"
              revealDelayMs={10}
            />
          </h1>

          {/* Upgraded Hero text readability */}
          <motion.p 
            variants={scrollFadeUp}
            className="text-sm sm:text-base text-app-text-muted leading-relaxed max-w-xl mx-auto font-medium"
          >
            Explore our comprehensive, premium sourcing catalog. We deliver elite digital engineering, custom electronics, enterprise computing, specialized IT equipment, and licensing solutions.
          </motion.p>
        </motion.div>

        {/* Categories / Filter Toolbar with Subtle Translucent Orange Active Styling */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-12"
        >
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'hardware', label: 'Computing & Hardware' },
            { id: 'network', label: 'Network & Security' },
            { id: 'av', label: 'Displays & AV' },
            { id: 'software', label: 'Software & Licenses' },
            { id: 'custom', label: 'Custom Sourcing' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase cursor-pointer transition-all duration-300 border ${
                activeFilter === btn.id
                  ? 'text-client-primary border-client-primary/30 z-10'
                  : 'text-app-text hover:text-client-primary bg-app-card/25 border-app-border/40 hover:border-app-border/80'
              }`}
            >
              {activeFilter === btn.id && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-client-primary/10 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          layout
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto gap-6 mb-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat) => {
              const IconComponent = ICON_MAP[cat.iconName] || Cpu;
              
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 15 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full relative group"
                >
                  <div className="glass-panel h-full border border-app-border/60 bg-white dark:bg-app-card/50 flex flex-col justify-between overflow-hidden shadow-md transition-all duration-300 hover:border-client-primary/35 rounded-2xl relative p-5">
                    {/* Spotlight Hover logic specifically for card */}
                    <SpotlightHover size={200} />
                    
                    <div className="space-y-4 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Header Details */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="w-10 h-10 rounded-xl bg-client-primary/10 border border-client-primary/20 flex items-center justify-center text-client-primary group-hover:bg-client-primary group-hover:text-black transition-all duration-300">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] font-extrabold text-client-primary uppercase tracking-widest bg-client-primary/10 px-2 py-0.5 rounded border border-client-primary/20">
                            {cat.categoryGroup}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-black font-heading text-app-text tracking-tight">
                          {cat.title}
                        </h3>
                        
                        <p className="text-xs text-app-text-muted leading-relaxed mt-2">
                          {cat.description}
                        </p>
                      </div>

                      {/* Sub-items Grid */}
                      <div className="mt-4 pt-4 border-t border-app-border/20">
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-app-text-muted/60 block mb-2">Scope / Sub-items</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subItems.map((sub, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="text-[10px] font-bold text-app-text bg-slate-100 dark:bg-[#151515] border border-app-border/40 px-2.5 py-0.5 rounded-lg"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Brand Tagging */}
                      <div className="mt-4 pt-4 border-t border-app-border/20">
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-app-text-muted/60 block mb-2">Key Brands</span>
                        <div className="flex flex-wrap gap-1">
                          {cat.brands.map((b, bIdx) => (
                            <span 
                              key={bIdx}
                              className="text-[9px] font-semibold text-client-primary bg-client-primary/5 border border-client-primary/15 px-2 py-0.5 rounded"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Launch website CTA link & arrow */}
                    <div className="border-t border-app-border/30 pt-4 mt-5 flex items-center justify-between relative z-10">
                      <Link
                        to="/get-quote"
                        className="relative inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-client-primary hover:text-client-primary-hover group/link cursor-pointer"
                      >
                        <span>Inquire Sourcing</span>
                        <ArrowRight className="w-3.5 h-3.5 text-client-primary transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Brand Overview Section */}
        <div className="mb-20 text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <span className="text-[9px] font-extrabold text-client-primary uppercase tracking-widest bg-client-primary/10 px-2 py-0.5 rounded">
              Brand Directory
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-heading text-app-text leading-tight mt-2.5">
              Trusted Brands in Our App
            </h2>
            <p className="text-xs text-app-text-muted leading-relaxed mt-1">
              We procure genuine products from top-tier original equipment manufacturers (OEMs) and licensed software vendors globally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_GROUPS.map((group, gIdx) => (
              <motion.div
                key={gIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: gIdx * 0.05 }}
                className="glass-panel bg-app-card/25 border border-app-border/45 rounded-xl p-4.5 text-left relative overflow-hidden group"
              >
                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-client-primary/2 rounded-full filter blur-xl" />
                
                <h4 className="text-xs font-extrabold text-client-primary uppercase tracking-wider pl-1.5 border-l-2 border-client-primary mb-3">
                  {group.name}
                </h4>

                <div className="flex flex-wrap gap-2 relative z-10">
                  {group.list.map((brand, bIdx) => (
                    <span 
                      key={bIdx}
                      className="text-xs font-bold text-app-text bg-slate-100/80 dark:bg-[#121212]/80 border border-app-border/30 px-3 py-1.5 rounded-lg hover:border-client-primary/30 transition-all duration-300 cursor-default"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Corporate Proof Segments (Metrics) */}
        <div className="mb-20 text-left space-y-8 content-visibility-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <span className="text-[9px] font-extrabold text-client-primary uppercase tracking-widest bg-client-primary/10 px-2 py-0.5 rounded">
              Operational Statistics
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-app-text leading-tight mt-2.5">
              Verified Scale & Capability
            </h2>
            <p className="text-[11px] text-app-text-muted leading-relaxed mt-1">
              Our sourcing volumes enable direct brand coordination and reliable client fulfillment networks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { numericValue: 15, suffix: "+", label: "Sourcing Categories", desc: "Complete vertical procurement setup from components to licenses." },
              { numericValue: 50, suffix: "+", label: "OEM Brands Partnered", desc: "Collaborating directly with global leaders in electronics & IT." },
              { numericValue: 10000, suffix: "+", label: "Sourced Products", desc: "A vast catalog of enterprise hardware, accessories and tools." },
              { numericValue: 100, suffix: "%", label: "Genuine Procurement", desc: "Rigorous sandboxed verification of serials, licenses, and components." }
            ].map((m, mIdx) => (
              <motion.div
                key={mIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: mIdx * 0.05 }}
                className="glass-panel bg-app-card/30 border border-app-border/50 hover:border-client-primary/20 rounded-xl p-4.5 text-left hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-client-primary/2 rounded-full filter blur-xl" />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-client-primary/10 border border-client-primary/20 flex items-center justify-center text-client-primary group-hover:bg-client-primary group-hover:text-black transition-all duration-300">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-0.5 relative z-10">
                  <div className="text-xl sm:text-2xl font-black text-client-primary font-heading tracking-tight leading-none">
                    <CountUp to={m.numericValue} suffix={m.suffix} />
                  </div>
                  <div className="text-[10px] font-bold text-app-text font-heading">
                    {m.label}
                  </div>
                  <p className="text-[10px] text-app-text-muted leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trusted Brands & CPO / GPO Sections */}
        <div className="mb-20 space-y-12">
          <TrustedBrands />
          <CPOSection />
          <GPOSection />
        </div>

        {/* CTA Segment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Subtle back glowing core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-client-primary/6 rounded-full filter blur-[100px] pointer-events-none" />

          <div className="glass-panel rounded-2xl p-6 md:p-10 bg-gradient-to-br from-app-card/90 via-app-card/75 to-app-bg border border-app-border/80 relative overflow-hidden orange-glow shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              
              <div className="flex-1 space-y-4 text-left">
                <div className="flex">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-client-primary/10 border border-client-primary/20 text-client-primary text-[10px] font-extrabold uppercase tracking-widest rounded-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Hassle-Free Sourcing Request</span>
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-app-text leading-tight">
                  Need a Specific Item? <span className="text-client-primary text-gradient-orange">We Source It For You</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5">
                  {[
                    { text: "Obsolete/Niche Components", icon: Cpu },
                    { text: "Bulk Enterprise Pricing", icon: Server },
                    { text: "OEM Authorized Products", icon: ShieldCheck }
                  ].map((feat, fIdx) => {
                    const FeatIcon = feat.icon;
                    return (
                      <div 
                        key={fIdx} 
                        className="flex items-center gap-2.5 bg-app-bg/50 dark:bg-app-card/40 border border-app-border/40 rounded-xl p-3.5 hover:border-client-primary/20 hover:bg-app-bg transition-all duration-300 group/item"
                      >
                        <div className="w-9 h-9 rounded-lg bg-client-primary/10 border border-client-primary/20 flex items-center justify-center text-client-primary shrink-0 group-hover/item:bg-client-primary group-hover/item:text-black transition-all duration-300">
                          <FeatIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-app-text leading-snug">{feat.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shrink-0 flex justify-center lg:justify-end">
                <Link
                  to="/get-quote"
                  className="relative inline-flex items-center gap-2 px-7 py-3.5 bg-client-primary hover:bg-client-primary-hover text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(215,25,32,0.4)] group cursor-pointer overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  <span>Request Custom RFQ</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
