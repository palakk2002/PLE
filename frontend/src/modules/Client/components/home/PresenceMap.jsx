import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCMS } from '../../hooks/useCMS';

export default function PresenceMap() {
  const { presenceMap } = useCMS();
  const { heading, description, locations } = presenceMap;

  return (
    <section className="py-24 relative overflow-hidden bg-app-bg dark:bg-[#0d1117] text-app-text">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-client-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text Content */}
        <div className="text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            {heading.split(' ')[0]} <span className="text-client-primary text-gradient-orange">{heading.split(' ').slice(1).join(' ')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-app-text-muted text-lg max-w-xl"
          >
            {description}
          </motion.p>
        </div>

        {/* Right Side: Map */}
        <div className="relative w-full aspect-square flex items-center justify-center">
          
          {/* Dark Mode Background Grid & Glow to highlight map */}
          <div className="absolute inset-0 z-0 hidden dark:block pointer-events-none">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(#3a4b6b 1px, transparent 1px), linear-gradient(90deg, #3a4b6b 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                backgroundPosition: 'center center'
              }}
            />
            {/* Center subtle glow behind the map */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#4facfe]/10 blur-[80px] rounded-full" />
            
            {/* Decorative connection lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <line x1="20%" y1="30%" x2="45%" y2="50%" stroke="#4facfe" strokeWidth="1" />
              <line x1="80%" y1="20%" x2="55%" y2="40%" stroke="#4facfe" strokeWidth="1" />
              <line x1="15%" y1="70%" x2="40%" y2="60%" stroke="#4facfe" strokeWidth="1" />
              <circle cx="20%" cy="30%" r="3" fill="#4facfe" />
              <circle cx="80%" cy="20%" r="3" fill="#4facfe" />
              <circle cx="15%" cy="70%" r="3" fill="#4facfe" />
            </svg>
          </div>

          {/* India Map Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full flex justify-center items-center opacity-40 dark:opacity-100 z-10"
          >
            <img 
              src="/india-removebg-preview.png" 
              alt="India Map" 
              className="w-full h-full object-contain dark:mix-blend-multiply"
            />
          </motion.div>

          {/* Location Pins */}
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              className="absolute flex flex-col items-center justify-center pointer-events-none z-20"
              style={{ top: loc.top, left: loc.left }}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.4 + (loc.delay || 0), type: 'spring', bounce: 0.5 }}
            >
              <div className="relative">
                {/* Ping Animation */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-client-primary opacity-75 animate-ping" />
                <div className="relative bg-app-bg p-2 rounded-full border border-client-primary/30 shadow-[0_0_15px_rgba(215,25,32,0.5)]">
                  <MapPin className="w-6 h-6 text-client-primary" />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + (loc.delay || 0) }}
                className={`absolute top-full mt-2 whitespace-nowrap bg-client-primary/90 border border-client-primary/50 px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md text-sm font-bold z-20 ${
                  loc.name.toLowerCase() === 'indore' ? 'text-white' : 'text-white'
                }`}
              >
                {loc.name}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

