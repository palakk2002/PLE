import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function CatalogueFullscreen({ children, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-dark-bg/98 text-white p-4 sm:p-6 overflow-hidden">
      {/* Fullscreen Header */}
      <div className="flex items-center justify-between border-b border-app-border/20 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-client-primary uppercase tracking-[0.2em]">
            PLE Catalogue
          </span>
          <span className="text-[10px] bg-client-primary/10 text-client-primary px-2 py-0.5 rounded font-bold uppercase">
            Fullscreen
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
          aria-label="Exit Fullscreen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main container holding the fullscreen book */}
      <div className="flex-grow flex items-center justify-center w-full max-h-[calc(100vh-120px)] overflow-hidden">
        <div className="w-full max-w-6xl h-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
