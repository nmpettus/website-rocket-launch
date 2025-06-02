
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryHorizontal } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { maggie_images } from "./maggie-images";

interface MaggieCarouselProps {
  onImageClick: (src: string) => void;
}

const MaggieCarousel = ({ onImageClick }: MaggieCarouselProps) => {
  return (
    <div className="relative px-12">
      <Carousel className="w-full">
        <CarouselContent>
          {maggie_images.slice(0, 12).map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => onImageClick(image.src)}
                >
                  <CardContent className="p-0 relative aspect-square group">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="h-full w-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200">
                      <GalleryHorizontal className="text-white opacity-0 group-hover:opacity-100 w-8 h-8" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default MaggieCarousel;
