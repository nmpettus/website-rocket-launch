import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  enlargedImage: string | null;
  onClose: () => void;
}

const ImageViewer = ({ enlargedImage, onClose }: ImageViewerProps) => {
  if (!enlargedImage) return null;
  
  return (
    <Dialog open={!!enlargedImage} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-1 bg-transparent border-none shadow-none">
        <DialogTitle className="sr-only">Enlarged Image View</DialogTitle>
        <div className="relative">
          <img 
            src={enlargedImage} 
            alt="Enlarged Book Cover" 
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
          <Button 
            className="absolute top-2 right-2 bg-gray-800/70 hover:bg-gray-900/90 text-white rounded-full h-8 w-8 p-0"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;