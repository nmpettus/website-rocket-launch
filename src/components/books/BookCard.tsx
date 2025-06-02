
import React from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Globe, Book } from "lucide-react";

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
  onOpenReviews: (bookId: string, title: string) => void;
  onImageClick: (imageSrc: string) => void;
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
  onOpenReviews,
  onImageClick,
}: BookCardProps) => {
  // Map language names to their respective badge colors
  const languageColors: Record<string, string> = {
    English: "bg-indigo-600",
    Spanish: "bg-amber-500",
    Italian: "bg-emerald-500",
  };

  // Convert "MAGGIE" to "Maggie" in the title
  const formattedTitle = title.replace(/MAGGIE/g, "Maggie");

  // Handler for language badge click
  const handleLanguageClick = (language: string) => {
    const link = languageLinks.find(l => l.language === language)?.url;
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full">
      <div className="p-3">
        <AspectRatio ratio={3/4}>
          <img 
            src={coverImage}
            alt={`${formattedTitle} Book Cover`}
            className="rounded-md object-contain w-full h-full cursor-pointer"
            onClick={() => onImageClick(coverImage)}
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
        <div className="flex w-full space-x-2">
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 flex items-center justify-center"
            onClick={() => window.open(amazonLink, "_blank")}
          >
            <Book className="w-4 h-4 mr-2" />
            Amazon
          </Button>
          <Button 
            variant="outline" 
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white flex-1"
            onClick={() => onOpenReviews(bookId, formattedTitle)}
          >
            Reviews
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
