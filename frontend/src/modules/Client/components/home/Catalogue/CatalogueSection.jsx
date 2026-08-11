import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import { BookOpen, AlertCircle, FileText } from 'lucide-react';
import CatalogueBook from './CatalogueBook';
import CatalogueControls from './CatalogueControls';
import CatalogueThumbnails from './CatalogueThumbnails';
import CatalogueFullscreen from './CatalogueFullscreen';
import './catalogue.css';

import workerContent from 'pdfjs-dist/build/pdf.worker.mjs?raw';

const blob = new Blob([workerContent], { type: 'text/javascript' });
const workerUrl = URL.createObjectURL(blob);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export default function CatalogueSection() {
  const [doc, setDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pdfUrl = '/catalogue/PLE-Catalogue.pdf';

  // Handle window resizing to switch between mobile single page & desktop two-page spreads
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and load PDF Document via PDFJS
  useEffect(() => {
    let active = true;

    async function loadPdf() {
      setLoading(true);
      setError(false);
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        if (active) {
          setDoc(pdf);
          setTotalPages(pdf.numPages);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading PDF document:', err);
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadPdf();
    return () => {
      active = false;
    };
  }, [pdfUrl]);

  // Handle keyboard page turn navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Home') {
        handleNavigate(1);
      } else if (e.key === 'End') {
        handleNavigate(totalPages);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isMobile]);

  const handlePrev = () => {
    if (currentPage <= 1) return;
    if (isMobile) {
      setCurrentPage((prev) => prev - 1);
    } else {
      // In double page mode, move back by 2 pages (unless going to cover page 1)
      setCurrentPage((prev) => (prev === 2 ? 1 : Math.max(1, prev - 2)));
    }
  };

  const handleNext = () => {
    if (isMobile) {
      if (currentPage >= totalPages) return;
      setCurrentPage((prev) => prev + 1);
    } else {
      if (currentPage >= totalPages - 1) return;
      // In double page mode, advance by 2 pages (from cover 1 to 2, then to 4, etc.)
      setCurrentPage((prev) => (prev === 1 ? 2 : Math.min(totalPages, prev + 2)));
    }
  };

  const handleNavigate = (pageNum) => {
    // Keep double page boundaries aligned on navigation
    if (!isMobile && pageNum > 1 && pageNum % 2 !== 0) {
      setCurrentPage(pageNum - 1);
    } else {
      setCurrentPage(pageNum);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(2.0, prev + 0.15));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.8, prev - 0.15));

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const renderBookContent = () => (
    <>
      <CatalogueBook
        doc={doc}
        totalPages={totalPages}
        currentPage={currentPage}
        zoom={zoom}
        isMobile={isMobile}
        onNavigate={handleNavigate}
      />
      
      <CatalogueControls
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        isFullscreen={isFullscreen}
        isMobile={isMobile}
        onPrev={handlePrev}
        onNext={handleNext}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFullscreen={handleToggleFullscreen}
        pdfUrl={pdfUrl}
      />

      <CatalogueThumbnails
        doc={doc}
        totalPages={totalPages}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </>
  );

  return (
    <section className="py-20 px-4 bg-app-bg relative overflow-hidden" id="catalogue">
      {/* Visual background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-client-primary/3 rounded-full filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-client-primary/5 rounded-full filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[2px] bg-client-primary" />
            <span className="text-xs font-black text-client-primary uppercase tracking-[0.3em] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Catalogue Portfolio
            </span>
            <span className="w-8 h-[2px] bg-client-primary" />
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-app-text leading-tight">
            Explore Our <span className="text-client-primary">Digital Catalogue</span>
          </h2>

          <p className="text-app-text-muted text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Flip through our verified selection of commercial components, IT infrastructure assets, corporate categories, and service capabilities.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-client-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-bold text-app-text-muted animate-pulse">
              Initializing Digital Catalogue...
            </span>
          </div>
        )}

        {/* Error Fallback State */}
        {error && (
          <div className="max-w-xl mx-auto p-8 bg-app-card rounded-2xl border border-app-border text-center shadow-xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-app-text mb-2">Could Not Load Catalogue</h3>
            <p className="text-xs text-app-text-muted mb-4 leading-relaxed">
              We encountered an issue preparing the interactive digital book viewer. You can access the catalogue directly by downloading the file below.
            </p>
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 rounded text-left border border-red-500/20 overflow-x-auto">
                <p className="text-[11px] font-mono text-red-400">
                  <strong>Error details:</strong> {error.message || String(error)}
                </p>
                {error.stack && (
                  <pre className="text-[9px] font-mono text-red-400/80 mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
            <a
              href={pdfUrl}
              download="PLE-Catalogue.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-client-primary hover:bg-client-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF Version</span>
            </a>
          </div>
        )}

        {/* Main interactive book render */}
        {!loading && !error && (
          <div className="w-full">
            {renderBookContent()}

            {/* Fullscreen Overlay handling */}
            <CatalogueFullscreen isOpen={isFullscreen} onClose={() => setIsFullscreen(false)}>
              {renderBookContent()}
            </CatalogueFullscreen>
          </div>
        )}

      </div>
    </section>
  );
}
