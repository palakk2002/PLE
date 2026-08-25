import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CataloguePage from './CataloguePage';

export default function CatalogueBook({ doc, totalPages, currentPage, zoom, isMobile, onNavigate }) {
  const [flipping, setFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'
  const [displayPage, setDisplayPage] = useState(currentPage);
  const prevPageRef = useRef(currentPage);

  // Synchronize display page with animations
  useEffect(() => {
    if (currentPage === displayPage) {
      prevPageRef.current = currentPage;
      return;
    }

    const direction = currentPage > prevPageRef.current ? 'next' : 'prev';
    setFlipDirection(direction);
    setFlipping(true);

    // Timeout duration matches the flip animation transition (1200ms)
    const timer = setTimeout(() => {
      setDisplayPage(currentPage);
      setFlipping(false);
      prevPageRef.current = currentPage;
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentPage, displayPage]);

  // Renders the spread layout (Left + Right Pages) on Desktop
  const renderDesktopSpread = () => {
    // Determine active pages during transition or normal state
    const current = flipping ? prevPageRef.current : currentPage;
    const target = currentPage;

      if (current === 1 && !flipping) {
        // Cover Page view
        return (
          <div className="w-full h-full flex justify-end relative shadow-2xl rounded-r-2xl overflow-hidden bg-white">
            <div className="w-[50%] h-full border-y border-r border-app-border relative">
              <CataloguePage doc={doc} pageNum={1} zoom={zoom} isMobile={false} />
              <div className="ple-catalogue-page-edge-right" />
            </div>
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-black/40 z-20" />
          </div>
        );
      }

    // Normal pages layout
    const leftPage = current;
    const rightPage = Math.min(current + 1, totalPages);
    
    // Underneath pages layout (visible during flip)
    const underLeft = flipDirection === 'next' ? current : target;
    const underRight = flipDirection === 'next' ? Math.min(target + 1, totalPages) : rightPage;

    return (
      <div className="w-full h-full flex relative select-none bg-white shadow-2xl rounded-2xl border border-app-border/40 overflow-hidden">
        {/* Static Left Page (Underneath or old) */}
        <div className="w-[50%] h-full bg-white border-r border-app-border/10 relative overflow-hidden">
          <CataloguePage
            doc={doc}
            pageNum={flipDirection === 'next' ? leftPage : underLeft}
            zoom={zoom}
            isMobile={false}
          />
          <div className="ple-catalogue-page-edge-left" />
        </div>

        {/* Center Spine Shadow Overlay */}
        <div className="ple-catalogue-spine" />

        {/* Static Right Page (Underneath or old) */}
        <div className="w-[50%] h-full bg-white relative overflow-hidden">
          {underRight <= totalPages ? (
            <>
              <CataloguePage
                doc={doc}
                pageNum={flipDirection === 'next' ? underRight : rightPage}
                zoom={zoom}
                isMobile={false}
              />
              <div className="ple-catalogue-page-edge-right" />
            </>
          ) : (
            <div className="w-full h-full bg-white/85 flex items-center justify-center text-app-text-muted text-xs">
              End of Catalogue
            </div>
          )}
        </div>

        {/* Flipping Page Container */}
        {flipping && (
          <div
            className={`absolute top-0 bottom-0 w-[50%] h-full transition-transform duration-[1200ms] ease-in-out z-30`}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
              left: flipDirection === 'next' ? '50%' : '0',
              transform: flipDirection === 'next' ? 'rotateY(-180deg)' : 'rotateY(180deg)',
            }}
          >
            {/* Front of the flipping page */}
            <div 
              className="absolute inset-0 w-full h-full bg-white border-l border-app-border/10"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <CataloguePage
                doc={doc}
                pageNum={flipDirection === 'next' ? rightPage : leftPage}
                zoom={zoom}
                isMobile={false}
              />
              {flipDirection === 'next' ? (
                <div className="ple-catalogue-page-edge-right" />
              ) : (
                <div className="ple-catalogue-page-edge-left" />
              )}
            </div>

            {/* Back of the flipping page */}
            <div 
              className="absolute inset-0 w-full h-full bg-white border-r border-app-border/10"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <CataloguePage
                doc={doc}
                pageNum={flipDirection === 'next' ? target : Math.min(target + 1, totalPages)}
                zoom={zoom}
                isMobile={false}
              />
              {flipDirection === 'next' ? (
                <div className="ple-catalogue-page-edge-left" />
              ) : (
                <div className="ple-catalogue-page-edge-right" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renders the single page layout on Mobile with Swipe transitions
  const renderMobileSpread = () => {
    return (
      <div className="w-full h-full bg-white rounded-2xl border border-app-border shadow-2xl overflow-hidden relative">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: flipDirection === 'next' ? 120 : -120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: flipDirection === 'next' ? -120 : 120 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <CataloguePage
              doc={doc}
              pageNum={currentPage}
              zoom={zoom}
              isMobile={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="ple-catalogue-container w-full h-[55vh] md:h-[65vh] lg:h-[70vh] flex items-center justify-center relative">
      <div 
        className="w-full max-w-5xl h-full ple-catalogue-book"
        style={{ perspective: '1800px' }}
      >
        {isMobile ? renderMobileSpread() : renderDesktopSpread()}
      </div>
    </div>
  );
}
