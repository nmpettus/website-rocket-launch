import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const AIAdventuresBook = () => {
  const book = booksData.find(b => b.id === "ai-adventures");
  const [showSampleViewer, setShowSampleViewer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO optimization
  useSEO({
    ...bookSEOData["ai-adventures"],
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
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link to={{ pathname: "/", hash: "#books" }} className="hover:text-blue-600">Books</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">AI Adventures with Maggie</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4 flex flex-col items-center justify-center w-full">
              <img
                src={book.coverImage}
                alt="AI Adventures with Maggie - Educational Children's Book Cover about artificial intelligence"
                className="max-w-md w-full rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(book.coverImage)}
              />
              
              {/* Sample Pages Button */}
              {book.samplePages && book.samplePages.length > 0 && (
                <Button
                  onClick={() => setShowSampleViewer(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mx-auto"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Sample Pages
                </Button>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  AI Adventures with Maggie
                </h1>
                
                {book.isNew && (
                  <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white mb-4">
                    NEW RELEASE
                  </Badge>
                )}

                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  {book.description}
                </p>

                {/* Enhanced Description for SEO */}
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Learn About AI in a Fun Way</h2>
                  <p className="text-gray-600 mb-4">
                    Join Maggie on exciting adventures as she introduces children to the fascinating world of artificial intelligence! This unique educational book makes complex technology concepts accessible and fun for young minds.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">What Kids Will Learn:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• What artificial intelligence really is</li>
                    <li>• How AI helps us in everyday life</li>
                    <li>• Simple coding and technology concepts</li>
                    <li>• The importance of using technology responsibly</li>
                    <li>• How AI can solve problems and help people</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• STEM education at home</li>
                    <li>• Future tech leaders</li>
                    <li>• Curious minds who love technology</li>
                    <li>• Preparing kids for the digital future</li>
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

              {/* Reviews - only show if there are reviews */}
              {book.reviewCount > 0 && (
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
              )}

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

                {book.appleBooksLink && (
                  <Button
                    asChild
                    className="w-full bg-charcoal hover:bg-charcoal/90 text-white"
                  >
                    <a href={book.appleBooksLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buy on Apple Books
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section for SEO */}
          <div className="mt-12 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What age group is this AI book suitable for?</h3>
                <p className="text-gray-600">AI Adventures with Maggie is perfect for children ages 7 and up who are curious about technology and how computers learn.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Do kids need any tech background to enjoy this book?</h3>
                <p className="text-gray-600">Not at all! Maggie, Riley, and Artie the robot introduce AI concepts from scratch in a fun, story-driven way that any child can follow.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can this book be used for homeschool or classroom STEM lessons?</h3>
                <p className="text-gray-600">Absolutely! It's ideal for homeschoolers, classroom reading, or family STEM time. The book covers pixels, patterns, and responsible technology use.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Who are the main characters?</h3>
                <p className="text-gray-600">The story features Maggie the smartest dog in the world, Riley the tech-curious kid, and Artie the friendly AI robot as they explore the world of artificial intelligence together.</p>
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

export default AIAdventuresBook;
