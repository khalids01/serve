
import React from 'react';

interface PdfViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export function PdfViewer({ url, title, className = "" }: PdfViewerProps) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-muted/20 ${className}`}>
      {/* Fallback for browsers that don't support object/embed */}
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full rounded-md"
        aria-label={title || "PDF document"}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-4 text-muted-foreground">
            This browser does not support displaying PDFs.
          </p>
          <a
            href={url}
            download
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Download PDF
          </a>
        </div>
      </object>
    </div>
  );
}
