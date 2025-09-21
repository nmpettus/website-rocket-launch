import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Eye } from "lucide-react";
import { booksData } from "@/data/bookReviews";
import bookReviews from "@/data/bookReviews";
import BookSampleViewer from "@/components/books/BookSampleViewer";
import ImageViewer from "@/components/books/ImageViewer";
import ReviewsModal from "@/components/ReviewsModal";
import { useSEO } from "@/hooks/useSEO";
import { bookSEOData } from "@/data/seoData";
import { createBookStructuredData } from "@/utils/seoUtils";

const CreationBook = () => {
  const book = booksData.find(b => b.id === "creation");
  const [showSampleViewer, setShowSampleViewer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO optimization
  useSEO({
    ...bookSEOData.creation,
    structuredData: book ? createBookStructuredData(book) : null
  });

  // Language links for Creation book
  const languageLinks = [
    { language: "English", url: "https://a.co/d/8DoEE31" },
    { language: "Spanish", url: "https://a.co/d/ccsCmGT" },
    { language: "Italian", url: "https://a.co/d/86irzfP" },
    { language: "Kindle", url: "https://www.amazon.com/Creation-told-Maggie-Beloved-Generation-ebook/dp/B0FRVXFZSX/ref=tmm_kin_swatch_0?_encoding=UTF8&dib_tag=se&dib=eyJ2IjoiMSJ9.BwbJeoyC49WDoBkR4KRx3JVNtDY6MUZIMID_hWhopZtE0_WaTTQw-3DV8w-xCkj7T4QqfvRvDhcV9fDk52e6sdtyogVW1uutZBMaUxVw3fXIBbkZIw3ttbO4BqymQFOtOM9StexQJtUTaG8ysIAjNGzRRQPRUV-27b5ImWNWpGdlmArdDzsBPkHgrUAAtpus.Iyo7h1nvFki8KhttY3go09QquyuIwT8lRxIrtyla2uw&qid=1758454617&sr=8-1" }
  ];

  const languageColors: Record<string, string> = {
    English: "bg-indigo-600",
    Spanish: "bg-amber-500",
    Italian: "bg-emerald-500",
    Kindle: "bg-purple-600",
  };

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleImageClick = (imageSrc: string) => {
    setEnlargedImage(imageSrc);
    setShowImageViewer(true);
  };

  const handleLanguageClick = (language: string) => {
    const link = languageLinks.find(l => l.language === language)?.url;
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">›</span>
            <a href="/#books" className="hover:text-blue-600">Books</a>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Creation as told by Maggie</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4">
              <img
                src={book.coverImage}
                alt="Creation as told by Maggie - Children's Bible Story Book Cover showing colorful illustrations of God's creation"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(book.coverImage)}
              />
              
              {/* Sample Pages Button */}
              {book.samplePages && book.samplePages.length > 0 && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowSampleViewer(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Sample Pages
                  </Button>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Creation as told by Maggie
                </h1>
                
                {book.isNew && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4">
                    NEW
                  </Badge>
                )}

                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  {book.description}
                </p>

                {/* Enhanced Description for SEO */}
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">About This Children's Bible Story</h2>
                  <p className="text-gray-600 mb-4">
                    Join Maggie as she takes children on an amazing journey through God's creation! This beautifully illustrated children's Bible book brings the creation story to life with engaging storytelling and colorful pictures that capture young imaginations.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• Children ages 3-8</li>
                    <li>• Bedtime Bible stories</li>
                    <li>• Sunday school lessons</li>
                    <li>• Homeschool religious education</li>
                    <li>• Family devotion time</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Educational Value:</h3>
                  <p className="text-gray-600 mb-4">
                    This book helps children understand God's amazing creation while developing reading skills, vocabulary, and spiritual awareness. The multilingual availability makes it perfect for diverse families and communities.
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Languages:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.languages.map((language) => {
                    const hasLink = languageLinks.some(l => l.language === language);
                    return (
                      <span 
                        key={language}
                        className={`${languageColors[language]} text-white text-sm px-3 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => handleLanguageClick(language)}
                        role="button"
                        title={`Open ${language} version of Creation as told by Maggie`}
                      >
                        {language}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center" role="img" aria-label="5 star rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Button
                  variant="link"
                  onClick={() => setShowReviews(true)}
                  className="text-blue-600 p-0 h-auto"
                >
                  Read {book.reviewCount} reviews
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  <a href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy on Amazon
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Section for SEO */}
          <div className="mt-12 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What age group is this creation story book suitable for?</h3>
                <p className="text-gray-600">This children's Bible book is perfect for ages 3-8, with simple language and beautiful illustrations that engage young readers.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is this book available in other languages?</h3>
                <p className="text-gray-600">Yes! "Creation as told by Maggie" is available in English, Spanish, and Italian, making it accessible to diverse families.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can this book be used for Sunday school?</h3>
                <p className="text-gray-600">Absolutely! This creation story book is perfect for Sunday school lessons, homeschool curricula, and family devotions.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What makes Maggie's Bible stories special?</h3>
                <p className="text-gray-600">Maggie brings a unique, child-friendly perspective to Bible stories, making them relatable and engaging for young minds while maintaining biblical accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Viewer */}
      {book.samplePages && (
        <BookSampleViewer
          isOpen={showSampleViewer}
          onClose={() => setShowSampleViewer(false)}
          bookTitle={book.title}
          samplePages={book.samplePages}
        />
      )}

      {/* Image Viewer */}
      <ImageViewer
        enlargedImage={enlargedImage}
        onClose={() => {
          setShowImageViewer(false);
          setEnlargedImage("");
        }}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        bookTitle={book.title}
        reviews={bookReviews[book.id] || []}
      />

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default CreationBook;
