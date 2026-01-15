import React from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Book, Eye, BookOpen, ShoppingCart } from "lucide-react";
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
  kindleLink: string;
  bookId: string;
  isNew?: boolean;
  comingSoon?: boolean;
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
  kindleLink,
  bookId,
  isNew = false,
  comingSoon = false,
  samplePages = [],
  onOpenReviews,
  onImageClick,
  onOpenSample,
}: BookCardProps) => {
  // Map language names to their respective badge colors
  const languageColors: Record<string, string> = {
    English: "bg-sage text-white",
    Spanish: "bg-gold text-charcoal",
    Italian: "bg-rose text-white",
    Kindle: "bg-charcoal text-white",
  };

  const formattedTitle = title.replace(/MAGGIE/g, "Maggie");

  const handleLanguageClick = (language: string) => {
    const link = languageLinks.find(l => l.language === language)?.url;
    if (link) {
      window.open(link, "_blank");
    }
  };

  const hasSamples = samplePages && samplePages.length > 0;

  // Map bookId to routes
  const getBookRoute = (bookId: string) => {
    const routeMap: Record<string, string> = {
      'creation': '/books/creation',
      'noah': '/books/noahs-ark',
      'jonah': '/books/jonah',
      'gods-love': '/books/gods-love',
      'ai-adventures': '/books/ai-adventures',
      'thanksgiving': '/books/thanksgiving',
      'christmas': '/books/christmas'
    };
    return routeMap[bookId];
  };

  const bookRoute = getBookRoute(bookId);

  return (
    <Card className="group overflow-hidden bg-white border-0 shadow-elegant hover:shadow-lg transition-all duration-500 flex flex-col h-full relative rounded-2xl">
      {/* Badge */}
      {comingSoon ? (
        <Badge className="absolute top-4 right-4 z-10 bg-gold hover:bg-gold-dark text-charcoal font-medium px-3 py-1">
          Coming Soon
        </Badge>
      ) : isNew ? (
        <Badge className="absolute top-4 right-4 z-10 bg-rose hover:bg-rose-dark text-white font-medium px-3 py-1">
          New Release
        </Badge>
      ) : null}
      
      {/* Book Cover with elegant presentation */}
      <div className="p-6 pb-4 bg-gradient-to-b from-sage-light/30 to-transparent">
        <div className="relative mx-auto flex justify-center">
          <img 
            src={coverImage}
            alt={`${formattedTitle} Book Cover`}
            className="max-h-72 w-auto rounded-lg object-contain cursor-pointer shadow-book transition-transform duration-300 group-hover:scale-[1.02]"
            onClick={() => onImageClick(coverImage)}
          />
        </div>
      </div>
      
      <CardContent className="p-6 pt-2 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-display font-semibold text-charcoal mb-3 text-center">
          {formattedTitle}
        </h3>
        
        {/* Language badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {languages.map((language) => {
            const hasLink = languageLinks.some(l => l.language === language);
            return (
              <span 
                key={language}
                className={`${languageColors[language] || 'bg-muted text-charcoal'} text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium ${hasLink ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                onClick={() => hasLink && handleLanguageClick(language)}
                role={hasLink ? "button" : undefined}
                title={hasLink ? `Open ${language} version` : undefined}
              >
                <Globe className="w-3 h-3" />
                {language}
              </span>
            );
          })}
        </div>
        
        {/* Description */}
        <p className="text-charcoal/70 text-sm text-center mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="flex text-gold">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <button 
            onClick={() => onOpenReviews(bookId, formattedTitle)}
            className="text-sm text-charcoal/60 hover:text-sage transition-colors"
          >
            ({reviewCount} reviews)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto">
          {bookRoute && (
            <Link to={bookRoute} className="block">
              <Button 
                size="sm"
                className="w-full bg-sage hover:bg-sage-dark text-white font-medium rounded-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm"
              variant="outline"
              className="border-sage text-sage hover:bg-sage hover:text-white font-medium rounded-full text-xs"
              onClick={() => window.open(amazonLink, "_blank")}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Amazon
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              className="border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white font-medium rounded-full text-xs"
              onClick={() => window.open(kindleLink, "_blank")}
            >
              <Book className="w-3 h-3 mr-1" />
              Kindle
            </Button>
          </div>
          
          {hasSamples && (
            <Button 
              size="sm"
              variant="ghost" 
              className="w-full text-sage hover:text-sage-dark hover:bg-sage-light font-medium rounded-full"
              onClick={() => onOpenSample(bookId, formattedTitle)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Sample Pages
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
