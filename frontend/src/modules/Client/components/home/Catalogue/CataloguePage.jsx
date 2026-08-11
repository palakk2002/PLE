import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

import workerContent from 'pdfjs-dist/build/pdf.worker.mjs?raw';

const blob = new Blob([workerContent], { type: 'text/javascript' });
const workerUrl = URL.createObjectURL(blob);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export default function CataloguePage({ doc, pageNum, zoom, isMobile, onRenderSuccess }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function renderPage() {
      if (!doc) return;
      setLoading(true);
      setError(false);

      try {
        const page = await doc.getPage(pageNum);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate responsive viewport scale based on parent width
        const containerWidth = canvas.parentElement?.clientWidth || 400;
        const initialViewport = page.getViewport({ scale: 1.0 });
        
        // Compute correct scale to fit container width/height
        const scaleX = containerWidth / initialViewport.width;
        // Cap the maximum scaling to keep high quality but avoid huge memory footprint
        const baseScale = isMobile ? scaleX * 1.5 : scaleX * 1.8;
        const scale = baseScale * zoom;

        const viewport = page.getViewport({ scale });

        // Set dimensions adjusting for high-DPI retina displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.scale(dpr, dpr);

        // Cancel previous render task if still running
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        
        if (active) {
          setLoading(false);
          if (onRenderSuccess) {
            onRenderSuccess(pageNum);
          }
        }
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error(`Error rendering PDF page ${pageNum}:`, err);
          if (active) {
            setError(true);
            setLoading(false);
          }
        }
      }
    }

    renderPage();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [doc, pageNum, zoom, isMobile]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-app-bg overflow-hidden select-none">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-app-card/30 animate-pulse">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-client-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-app-text-muted">Rendering page {pageNum}...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-red-500/10">
          <span className="text-xs text-red-500 font-bold mb-1">Failed to render page</span>
          <span className="text-[10px] text-app-text-muted">Please check your connection or try again.</span>
        </div>
      )}

      <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-md" />
    </div>
  );
}
