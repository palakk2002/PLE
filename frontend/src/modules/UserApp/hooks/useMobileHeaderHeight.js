import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to calculate the height of the mobile header dynamically
 * This is useful for adding padding-top to mobile page content
 */
const useMobileHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(64); // Default fallback
  const location = useLocation();

  useEffect(() => {
    const header = document.querySelector('header[class*="fixed"]');
    if (!header) return;

    // Set initial height
    setHeaderHeight(header.offsetHeight);

    // Set up observer to track any height change dynamically
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.target.offsetHeight);
      }
    });

    resizeObserver.observe(header);

    // Run fallback checks just in case
    const timeoutId = setTimeout(() => {
      if (header) setHeaderHeight(header.offsetHeight);
    }, 100);
    const timeoutId2 = setTimeout(() => {
      if (header) setHeaderHeight(header.offsetHeight);
    }, 500);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [location.pathname]); // Re-bind observer if route changes

  return headerHeight;
};

export default useMobileHeaderHeight;

