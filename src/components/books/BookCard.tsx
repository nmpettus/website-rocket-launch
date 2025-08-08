
import React from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Book, Eye, BookOpen } from "lucide-react";
import { SamplePage } from "@/data/bookReviews";
import { Link } from "react-router-dom";

interface LanguageLink {
  language: string;
  url: string;
}

interface BookCardProps {
  coverImage: string;
  title: string;
  languages: string[];
  languageLinks?: LanguageLink[];
  description: string;
  reviewCount: number;
  amazonLink: string;
  bookId: string;
  isNew?: boolean;
  samplePages?: SamplePage[];
  onOpenReviews: (bookId: string, title: string) => void;
  onImageClick: (imageSrc: string) => void;
  onOpenSample: (bookId: string, title: string) => void;
}

const BookCard = ({
  coverImage,
  title,
  languages,
  languageLinks = [],
  description,
  reviewCount,
  amazonLink,
  bookId,
  isNew = false,
  samplePages = [],
  onOpenReviews,
  onImageClick,
  onOpenSample,
}: BookCardProps) => {
  // Map language names to their respective badge colors
  const languageColors: Record<string, string> = {
    English: "bg-indigo-600",
    Spanish: "bg-amber-500",
    Italian: "bg-emerald-500",
  };

  const formattedTitle = title.replace(/MAGGIE/g, "Maggie");

  const handleLanguageClick = (language: string) => {
    const link = languageLinks.find(l => l.language === language)?.url;
    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image for ${bookId}:`, coverImage);
    console.log("Image error event:", e);
    console.log("Full image path being attempted:", coverImage);
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded image for ${bookId}:`, coverImage);
  };

  console.log(`BookCard ${bookId} rendering with image:`, coverImage);

  const hasSamples = samplePages && samplePages.length > 0;

  // Map bookId to routes
  const getBookRoute = (bookId: string) => {
    const routeMap: Record<string, string> = {
      'creation': '/books/creation',
      'noah': '/books/noahs-ark',
      'jonah': '/books/jonah',
      'gods-love': '/books/gods-love',
      'ai-adventures': '/books/ai-adventures'
    };
    return routeMap[bookId];
  };

  const bookRoute = getBookRoute(bookId);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full relative">
      {isNew && (
        <Badge className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white">
          New
        </Badge>
      )}
      <div className="p-3">
        <AspectRatio ratio={3/4}>
          <img 
            src={coverImage}
            alt={`${formattedTitle} Book Cover`}
            className="rounded-md object-contain w-full h-full cursor-pointer"
            onClick={() => onImageClick(coverImage)}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </AspectRatio>
      </div>
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{formattedTitle}</h3>
        <div className="flex flex-wrap mb-4">
          {languages.map((language) => {
            const hasLink = languageLinks.some(l => l.language === language);
            return (
              <span 
                key={language}
                className={`${languageColors[language]} text-white text-xs px-2 py-1 rounded mr-2 mb-1 flex items-center ${hasLink ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => hasLink && handleLanguageClick(language)}
                role={hasLink ? "button" : undefined}
                title={hasLink ? `Open ${language} version` : undefined}
              >
                <Globe className="w-3 h-3 mr-1" />
                {language}
              </span>
            );
          })}
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <span className="text-gray-500 ml-2">({reviewCount} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
        <div className="flex flex-col w-full gap-2">
          {/* View Details Button - Full Width */}
          {bookRoute && (
            <Link to={bookRoute} className="w-full">
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white w-full"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </Link>
          )}
          
          {/* Action Buttons Row */}
          <div className="flex w-full gap-2">
            <Button 
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 min-w-0"
              onClick={() => window.open(amazonLink, "_blank")}
            >
              <Book className="w-3 h-3 mr-1" />
              Amazon
            </Button>
            
            {hasSamples && (
              <Button 
                size="sm"
                variant="outline" 
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white flex-1 min-w-0"
                onClick={() => onOpenSample(bookId, formattedTitle)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Sample
              </Button>
            )}
            
            <Button 
              size="sm"
              variant="outline" 
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white flex-1 min-w-0"
              onClick={() => onOpenReviews(bookId, formattedTitle)}
            >
              Reviews
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
