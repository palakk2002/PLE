import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export default function CatalogueThumbnails({ doc, totalPages, currentPage, onNavigate }) {
  const containerRef = useRef(null);
  const [renderedThumbnails, setRenderedThumbnails] = useState({});
  const renderedRefs = useRef({});

  // Render a specific thumbnail to an image data URL
  const renderThumbnail = async (pageIndex) => {
    if (!doc || renderedThumbnails[pageIndex] || renderedRefs.current[pageIndex]) return;
    
    renderedRefs.current[pageIndex] = true; // Mark as rendering
    try {
      const page = await doc.getPage(pageIndex);
      const viewport = page.getViewport({ scale: 0.15 }); // Low scale for thumbnails
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL();
      
      setRenderedThumbnails((prev) => ({
        ...prev,
        [pageIndex]: dataUrl,
      }));
    } catch (err) {
      console.warn(`Failed to render thumbnail ${pageIndex}`, err);
      delete renderedRefs.current[pageIndex];
    }
  };

  // Scroll active page thumbnail into view smoothly
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(`[data-index="${currentPage}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentPage]);

  // Dynamically render thumbnails for pages near the current view
  useEffect(() => {
    if (!doc) return;
    // Render current, plus 3 ahead, plus 3 behind
    const start = Math.max(1, currentPage - 3);
    const end = Math.min(totalPages, currentPage + 3);
    
    for (let i = start; i <= end; i++) {
      renderThumbnail(i);
    }
  }, [doc, currentPage, totalPages]);

  return (
    <div className="w-full mt-6 py-2 px-1">
      <div 
        ref={containerRef}
        className="ple-thumbnail-strip flex gap-3 overflow-x-auto py-2 scroll-smooth select-none"
      >
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage || 
            (pageNum === currentPage + 1 && currentPage % 2 === 0);
          
          return (
            <button
              key={pageNum}
              data-index={pageNum}
              onClick={() => onNavigate(pageNum)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 focus:outline-none focus:ring-1 focus:ring-client-primary rounded p-1 transition-all ${
                isActive 
                  ? 'border border-client-primary bg-client-primary/10 scale-105' 
                  : 'border border-app-border hover:border-client-primary/50'
              }`}
            >
              <div className="w-14 h-20 bg-app-card/40 rounded overflow-hidden flex items-center justify-center">
                {renderedThumbnails[pageNum] ? (
                  <img 
                    src={renderedThumbnails[pageNum]} 
                    alt={`Page ${pageNum}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                ) : (
                  <div className="text-[10px] text-app-text-muted font-bold">{pageNum}</div>
                )}
              </div>
              <span className="text-[9px] font-bold text-app-text-muted">{pageNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
