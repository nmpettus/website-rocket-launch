
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

interface SamplePage {
  src: string;
  pageNumber: number;
  alt: string;
}

interface BookSampleViewerProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  samplePages: SamplePage[];
}

const BookSampleViewer = ({ isOpen, onClose, bookTitle, samplePages }: BookSampleViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!samplePages || samplePages.length === 0) return null;

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : samplePages.length - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < samplePages.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPreviousPage();
    if (e.key === "ArrowRight") goToNextPage();
    if (e.key === "Escape") onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-2 bg-white border-none shadow-xl"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">{bookTitle} Sample Pages</DialogTitle>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {bookTitle} - Sample
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {samplePages.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Image Display */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-[500px] relative">
          <img
            src={samplePages[currentPage].src}
            alt={samplePages[currentPage].alt}
            className={`max-w-full max-h-full object-contain rounded transition-transform duration-200 ${
              isZoomed ? "scale-150 cursor-grab" : "cursor-default"
            }`}
            style={{ maxHeight: isZoomed ? "none" : "70vh" }}
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center p-4 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={samplePages.length <= 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {/* Page Indicators */}
          <div className="flex space-x-2">
            {samplePages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? "bg-indigo-600" : "bg-gray-300"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={samplePages.length <= 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookSampleViewer;
