import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CataloguePage from './CataloguePage';

export default function CatalogueBook({ doc, totalPages, currentPage, zoom, isMobile, onNavigate }) {
  const [flipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState('next');
  const [loadedPages, setLoadedPages] = useState({});

  const handlePageRendered = (pageNum) => {
    setLoadedPages((prev) => ({ ...prev, [pageNum]: true }));
  };

  // Perform 3D page flip effect with state trigger
  const turnPage = (nextPage, dir) => {
    if (flipping) return;
    setDirection(dir);
    setFlipping(true);
    
    // Smooth timing matching CSS transition
    setTimeout(() => {
      onNavigate(nextPage);
      setFlipping(false);
    }, 600);
  };

  // Renders the spread layout (Left + Right Pages) on Desktop
  const renderDesktopSpread = () => {
    // If we're on the cover page (Page 1)
    if (currentPage === 1) {
      return (
        <div className="w-full h-full flex justify-end relative">
          {/* Cover sits on the right side of the book binder */}
          <div className="w-[50%] h-full bg-app-card rounded-r-2xl border-y border-r border-app-border shadow-2xl relative overflow-hidden">
            <CataloguePage
              doc={doc}
              pageNum={1}
              zoom={zoom}
              isMobile={false}
              onRenderSuccess={handlePageRendered}
            />
            <div className="ple-catalogue-page-edge-right" />
          </div>
          {/* Subtle representation of the spine shadow on the binder fold */}
          <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-black/40 z-20" />
        </div>
      );
    }

    // Normal Two-Page Spread
    const leftPage = currentPage;
    const rightPage = Math.min(currentPage + 1, totalPages);

    return (
      <div className="w-full h-full flex relative select-none">
        {/* Left Page */}
        <div className="w-[50%] h-full bg-app-card rounded-l-2xl border-y border-l border-app-border shadow-2xl relative overflow-hidden">
          <CataloguePage
            doc={doc}
            pageNum={leftPage}
            zoom={zoom}
            isMobile={false}
            onRenderSuccess={handlePageRendered}
          />
          <div className="ple-catalogue-page-edge-left" />
        </div>

        {/* Center Spine Overlay */}
        <div className="ple-catalogue-spine" />

        {/* Right Page */}
        <div className="w-[50%] h-full bg-app-card rounded-r-2xl border-y border-r border-app-border shadow-2xl relative overflow-hidden">
          {rightPage <= totalPages ? (
            <>
              <CataloguePage
                doc={doc}
                pageNum={rightPage}
                zoom={zoom}
                isMobile={false}
                onRenderSuccess={handlePageRendered}
              />
              <div className="ple-catalogue-page-edge-right" />
            </>
          ) : (
            <div className="w-full h-full bg-app-bg/80 flex items-center justify-center text-app-text-muted text-xs">
              End of Catalogue
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renders the single page layout on Mobile with Swipe transitions
  const renderMobileSpread = () => {
    return (
      <div className="w-full h-full bg-app-card rounded-2xl border border-app-border shadow-2xl overflow-hidden relative">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'next' ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <CataloguePage
              doc={doc}
              pageNum={currentPage}
              zoom={zoom}
              isMobile={true}
              onRenderSuccess={handlePageRendered}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="ple-catalogue-container w-full h-[55vh] md:h-[65vh] lg:h-[70vh] flex items-center justify-center relative">
      <div 
        className={`w-full max-w-5xl h-full ple-catalogue-book transition-transform ${
          flipping ? 'scale-[0.99] rotate-y-1' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {isMobile ? renderMobileSpread() : renderDesktopSpread()}
      </div>
    </div>
  );
}
