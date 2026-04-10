import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Book, Eye, BookOpen, ShoppingCart, Download } from "lucide-react";
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
  isFree?: boolean;
  pdfDownloadUrl?: string;
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
  isFree = false,
  pdfDownloadUrl,
  onOpenReviews,
  onImageClick,
  onOpenSample,
}: BookCardProps) => {
  const [isJumping, setIsJumping] = useState(false);
  const barkAudioRef = useRef<HTMLAudioElement | null>(null);
  const isAIAdventures = bookId === "ai-adventures";

  const handleMouseEnter = () => {
    if (isAIAdventures) {
      setIsJumping(true);
      // Play bark sound
      if (!barkAudioRef.current) {
        barkAudioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleAN2xN3teleAJ3y7yre0ol94YWx7hImCc11SY4CVnpN6Xk5ZfJahnI1yYWJwfoKAbmlhZ3V9goB4bmRlcHh7eXRsZWZrcHJxbmpmZmlrbGxqaGZmaGhoZ2ZlZGRkZGRjYmFhYWFhYGBfX19fX19eXl5eXl5dXV1dXV1cXFxcXFxbW1tbW1taWlpaWlpZWVlZWVlZWFhYWFhYV1dXV1dXV1ZWVlZWVlZVVVVVVVVVVFRUVFRUU1NTU1NTU1JSUlJSUlFRUVFRUVBQUFBQUE9PT09PT09OTk5OTk5NTU1NTU1MTExMTExLS0tLS0tKSkpKSkpJSUlJSUlISEhISEhHR0dHR0dGRkZGRkZFRUVFRUVEREREREQ=");
      }
      barkAudioRef.current.currentTime = 0;
      barkAudioRef.current.volume = 0.3;
      barkAudioRef.current.play().catch(() => {}); // Catch any autoplay restrictions
      
      // Reset animation after it completes
      setTimeout(() => setIsJumping(false), 600);
    }
  };

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
      'christmas': '/books/christmas',
      'easter': '/books/easter'
    };
    return routeMap[bookId];
  };

  const bookRoute = getBookRoute(bookId);

  return (
    <Card 
      className="group overflow-hidden bg-white border-0 shadow-elegant hover:shadow-lg transition-all duration-500 flex flex-col h-full relative rounded-2xl"
      onMouseEnter={handleMouseEnter}
    >
      {/* Badge - positioned to not overlap with cover image */}
      {isFree ? (
        <Badge className="absolute top-3 left-4 z-20 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1 shadow-md">
          Free Download
        </Badge>
      ) : comingSoon ? (
        <Badge className="absolute top-3 left-4 z-20 bg-gold hover:bg-gold-dark text-charcoal font-medium px-3 py-1 shadow-md">
          Coming Soon
        </Badge>
      ) : isNew ? (
        <Badge className="absolute top-3 left-4 z-20 bg-rose hover:bg-rose-dark text-white font-medium px-3 py-1 shadow-md">
          New Release
        </Badge>
      ) : null}
      
      {/* Book Cover with elegant presentation */}
      <div className="p-6 pb-4 bg-gradient-to-b from-sage-light/30 to-transparent">
        <div className="relative mx-auto flex justify-center">
          <img 
            src={coverImage}
            alt={`${formattedTitle} Book Cover`}
            className={`max-h-72 w-auto rounded-lg object-contain cursor-pointer shadow-book transition-transform duration-300 group-hover:scale-[1.02] ${isJumping ? 'animate-maggie-jump' : ''}`}
            onClick={() => onImageClick(coverImage)}
          />
          {/* Bark speech bubble */}
          {isJumping && isAIAdventures && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold animate-bounce-in shadow-lg">
              Woof! 🐾
            </div>
          )}
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
          {bookId === 'bible-heroes' ? (
            <a href="https://booksbymaggie.com/heroes" target="_blank" rel="noopener noreferrer" className="block">
              <Button 
                size="sm"
                className="w-full bg-sage hover:bg-sage-dark text-white font-medium rounded-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read Online
              </Button>
            </a>
          ) : bookRoute ? (
            <Link to={bookRoute} className="block">
              <Button 
                size="sm"
                className="w-full bg-sage hover:bg-sage-dark text-white font-medium rounded-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          ) : null}
          
          {isFree && pdfDownloadUrl ? (
            <Button 
              asChild
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full"
            >
              <a href={pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download Free PDF
              </a>
            </Button>
          ) : bookId !== 'bible-heroes' && (
            <div className={`grid ${kindleLink ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              <Button 
                size="sm"
                variant="outline"
                className="border-sage text-sage hover:bg-sage hover:text-white font-medium rounded-full text-xs"
                onClick={() => window.open(amazonLink, "_blank")}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Amazon
              </Button>
              
              {kindleLink && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white font-medium rounded-full text-xs"
                  onClick={() => window.open(kindleLink, "_blank")}
                >
                  <Book className="w-3 h-3 mr-1" />
                  Kindle
                </Button>
              )}
            </div>
          )}
          
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
