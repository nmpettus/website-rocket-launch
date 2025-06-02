
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { maggie_images } from "./maggie-images";
import { ChevronLeft, ChevronRight, Printer, X } from "lucide-react";

interface MaggieImageViewerProps {
  selectedImage: string | null;
  onClose: () => void;
  onSelectImage: (src: string) => void;
}

const MaggieImageViewer = ({ selectedImage, onClose, onSelectImage }: MaggieImageViewerProps) => {
  const currentIndex = maggie_images.findIndex(img => img.src === selectedImage);
  
  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : maggie_images.length - 1;
    onSelectImage(maggie_images[newIndex].src);
  };
  
  const handleNext = () => {
    const newIndex = currentIndex < maggie_images.length - 1 ? currentIndex + 1 : 0;
    onSelectImage(maggie_images[newIndex].src);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const currentImg = maggie_images[currentIndex];
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Maggie Photo</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f9f9f9;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
              h1 {
                font-family: Arial, sans-serif;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${currentImg.alt}</h1>
              <img src="${currentImg.src}" alt="${currentImg.alt}" />
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Dialog open={!!selectedImage} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black bg-opacity-90">
        <DialogTitle className="sr-only">Maggie Image Gallery View</DialogTitle>
        <div className="flex items-center justify-center w-full h-full relative">
          <img 
            src={selectedImage || ''} 
            alt="Full size image" 
            className="max-h-[80vh] max-w-full object-contain" 
          />
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 hover:bg-black/70 border-0 text-white rounded-full"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 hover:bg-black/70 border-0 text-white rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-0 text-white rounded-full h-9 w-9"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous image</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border-0 text-white rounded-full h-9 w-9"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next image</span>
          </Button>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-auto px-4">
            {maggie_images.map((img, i) => (
              <button
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${selectedImage === img.src ? 'bg-white' : 'bg-gray-500/50'}`}
                onClick={() => onSelectImage(img.src)}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaggieImageViewer;
