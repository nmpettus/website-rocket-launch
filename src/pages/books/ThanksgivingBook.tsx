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

const ThanksgivingBook = () => {
  const book = booksData.find(b => b.id === "thanksgiving");
  const [showSampleViewer, setShowSampleViewer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO optimization
  useSEO({
    ...bookSEOData["thanksgiving"],
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-orange-600">Home</a>
            <span className="mx-2">›</span>
            <a href="/#books" className="hover:text-orange-600">Books</a>
            <span className="mx-2">›</span>
            <span className="text-gray-800">The First Thanksgiving as told by Maggie</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4">
              <img
                src={book.coverImage}
                alt="The First Thanksgiving as told by Maggie - Children's Thanksgiving Book Cover"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(book.coverImage)}
              />
              
              {/* Sample Pages Button */}
              {book.samplePages && book.samplePages.length > 0 && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowSampleViewer(true)}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
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
                  The First Thanksgiving as told by Maggie: A Yorkie's Tail of History, Gratitude, and Unexpected Friendship
                </h1>
                
                {book.isNew && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white mb-4">
                    NEW
                  </Badge>
                )}

                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  {book.description}
                </p>

                {/* Enhanced Description for SEO */}
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Discover the First Thanksgiving with Maggie</h2>
                  <p className="text-gray-600 mb-4">
                    Wag your tail into American history! Follow Maggie, an adorable Yorkie with a big heart and even bigger personality, as she takes you on a hilarious, heartwarming journey through the true story of the First Thanksgiving.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Children Will Learn:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>🍂 The true story of the Pilgrims' journey to America</li>
                    <li>🍂 How the Native Americans helped the settlers survive</li>
                    <li>🍂 The importance of gratitude and giving thanks</li>
                    <li>🍂 How unexpected friendships can change everything</li>
                    <li>🍂 The faith and perseverance of the early settlers</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• Thanksgiving family reading traditions</li>
                    <li>• Classroom history lessons</li>
                    <li>• Teaching children about gratitude</li>
                    <li>• Kids who love adventure, history, and dogs!</li>
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
                  className="text-orange-600 p-0 h-auto"
                >
                  Read {book.reviewCount} reviews
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                >
                  <a href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy on Amazon
                  </a>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white"
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

export default ThanksgivingBook;
