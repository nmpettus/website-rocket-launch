
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { maggie_images } from "./maggie/maggie-images";

interface MaggieImageViewerProps {
  selectedImage: string | null;
  onClose: () => void;
  onSelectImage: (src: string) => void;
}

const MaggieImageViewer = ({ selectedImage, onClose, onSelectImage }: MaggieImageViewerProps) => {
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
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 border-0 text-white rounded-full"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            &times;
          </Button>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {maggie_images.map((img, i) => (
              <button
                key={i}
                className={`h-2 w-12 rounded-full transition-colors ${selectedImage === img.src ? 'bg-white' : 'bg-gray-500/50'}`}
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
