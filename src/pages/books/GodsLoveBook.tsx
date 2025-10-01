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

const GodsLoveBook = () => {
  const book = booksData.find(b => b.id === "gods-love");
  const [showSampleViewer, setShowSampleViewer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO optimization
  useSEO({
    ...bookSEOData["gods-love"],
    structuredData: book ? createBookStructuredData(book) : null
  });

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleImageClick = (imageSrc: string) => {
    setEnlargedImage(imageSrc);
    setShowImageViewer(true);
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
            <span className="text-gray-800">God's Love as told by Maggie</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4">
              <img
                src={book.coverImage}
                alt="God's Love as told by Maggie - Children's Christian Book Cover showing God's love and care"
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
                  God's Love as told by Maggie
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Discover God's Amazing Love</h2>
                  <p className="text-gray-600 mb-4">
                    Through Maggie's heartwarming storytelling, children will discover the depth and wonder of God's unconditional love. This beautiful Christian children's book helps young hearts understand how much God cares for them every single day.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">What Children Will Discover:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• God's love is unconditional and never-ending</li>
                    <li>• How God shows His love in everyday life</li>
                    <li>• They are precious and valuable to God</li>
                    <li>• God's love helps us love others</li>
                    <li>• God's care and protection are always with us</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For Building:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• Self-esteem and confidence</li>
                    <li>• Understanding of God's character</li>
                    <li>• Foundation for faith</li>
                    <li>• Emotional security and comfort</li>
                  </ul>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Languages:</h3>
                <div className="flex flex-wrap gap-2">
                  {book.languages.map((language) => (
                    <Badge key={language} variant="outline" className="text-sm">
                      {language}
                    </Badge>
                  ))}
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
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                >
                  <a href={book.kindleLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy Kindle Version
                  </a>
                </Button>
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

export default GodsLoveBook;
