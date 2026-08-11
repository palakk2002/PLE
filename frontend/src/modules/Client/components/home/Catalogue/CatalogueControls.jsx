import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, Download } from 'lucide-react';

export default function CatalogueControls({
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  isMobile,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  pdfUrl,
}) {
  const percentage = Math.round(zoom * 100);

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-app-card/60 backdrop-blur rounded-2xl border border-app-border">
      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.8}
          className="p-2 bg-app-bg hover:bg-client-primary/10 border border-app-border text-app-text hover:text-client-primary rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-muted"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-black min-w-[50px] text-center text-app-text">
          {percentage}%
        </span>
        <button
          onClick={onZoomIn}
          disabled={zoom >= 2.0}
          className="p-2 bg-app-bg hover:bg-client-primary/10 border border-app-border text-app-text hover:text-client-primary rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-muted"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="px-4 py-2 flex items-center gap-1 bg-app-bg hover:bg-client-primary/15 border border-app-border text-app-text hover:text-client-primary rounded-xl transition-all font-black text-xs uppercase tracking-wider disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="text-xs font-black text-app-text uppercase tracking-widest min-w-[80px] text-center">
          {isMobile ? (
            `Page ${currentPage} / ${totalPages}`
          ) : (
            currentPage === 1 
              ? `Cover / ${totalPages}` 
              : currentPage >= totalPages 
                ? `${totalPages} / ${totalPages}` 
                : `${currentPage}-${Math.min(currentPage + 1, totalPages)} / ${totalPages}`
          )}
        </span>

        <button
          onClick={onNext}
          disabled={isMobile ? currentPage >= totalPages : currentPage >= totalPages - 1}
          className="px-4 py-2 flex items-center gap-1 bg-app-bg hover:bg-client-primary/15 border border-app-border text-app-text hover:text-client-primary rounded-xl transition-all font-black text-xs uppercase tracking-wider disabled:opacity-40"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Utility Actions */}
      <div className="flex items-center gap-2">
        <a
          href={pdfUrl}
          download="PLE-Catalogue.pdf"
          className="p-2 bg-app-bg hover:bg-client-primary/10 border border-app-border text-app-text hover:text-client-primary rounded-xl transition-all flex items-center justify-center"
          title="Download PDF Catalogue"
          aria-label="Download PDF Catalogue"
        >
          <Download className="w-4 h-4" />
        </a>

        <button
          onClick={onToggleFullscreen}
          className="p-2 bg-app-bg hover:bg-client-primary/10 border border-app-border text-app-text hover:text-client-primary rounded-xl transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
