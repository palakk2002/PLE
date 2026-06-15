import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

const pageVariants = {
  initial: (direction) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) {
      // Premium desktop transition: subtle lift, scale, and fade
      return {
        opacity: 0,
        y: 12,
        scale: 0.995,
      };
    }
    return {
      opacity: 0,
      x: direction === 'forward' ? 40 : direction === 'back' ? -40 : 0,
      y: direction === 'forward' || direction === 'back' ? 0 : 12,
    };
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1
  }
};

const pageTransition = {
  type: 'tween',
  ease: [0.21, 1.02, 0.43, 1.01], // Custom ultra-smooth easeOutExpo-like transition
  duration: 0.45
};

/**
 * Page transition wrapper for smooth route changes with direction-based animations
 * Note: Exit animations removed as they require AnimatePresence at Routes level
 * RouteWrapper handles component remounting via key prop
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [direction, setDirection] = useState('none');
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Determine direction based on path changes
  useEffect(() => {
    const pathDepth = (path) => path.split('/').filter(Boolean).length;
    const currentDepth = pathDepth(location.pathname);
    const previousDepth = pathDepth(prevPath);

    if (currentDepth > previousDepth) {
      setDirection('forward');
    } else if (currentDepth < previousDepth) {
      setDirection('back');
    } else {
      setDirection('none');
    }

    setPrevPath(location.pathname);
  }, [location.pathname, prevPath]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Memoize the unique key to ensure it updates when location path changes
  const uniqueKey = useMemo(() => location.pathname, [location.pathname]);

  // Use a regular div with key to ensure proper remounting, then wrap with motion
  // This prevents motion.div from interfering with React Router's remounting mechanism
  return (
    <div key={uniqueKey} className="w-full">
      <motion.div
        custom={direction}
        initial="initial"
        animate="animate"
        variants={pageVariants}
        transition={pageTransition}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageTransition;

