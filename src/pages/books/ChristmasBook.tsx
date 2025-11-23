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

const ChristmasBook = () => {
  const book = booksData.find(b => b.id === "christmas");
  const [showSampleViewer, setShowSampleViewer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO optimization
  useSEO({
    ...bookSEOData["christmas"],
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-red-600">Home</a>
            <span className="mx-2">›</span>
            <a href="/#books" className="hover:text-red-600">Books</a>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Christmas as told by Maggie</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4">
              <img
                src={book.coverImage}
                alt="Christmas as told by Maggie - Children's Christian Christmas Book Cover showing God's promises and the nativity story"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(book.coverImage)}
              />
              
              {/* Sample Pages Button */}
              {book.samplePages && book.samplePages.length > 0 && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowSampleViewer(true)}
                    className="bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white"
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
                  Christmas as told by Maggie: Discovering the Christmas Story Through God's Promises
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Discover Christmas Through God's Promises</h2>
                  <p className="text-gray-600 mb-4">
                    With soft humor, childlike wonder, and a tender narrator's voice, Maggie helps children understand the profound meaning of Christmas through God's ancient promises that came true on that holy night.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Children Will Learn:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>✨ Why Jesus' birth was foretold hundreds of years before it happened</li>
                    <li>✨ How God kept every promise—perfectly, lovingly, and right on time</li>
                    <li>✨ What the star, shepherds, and manger really meant</li>
                    <li>✨ Why the birth of Christ is God's greatest gift to the world</li>
                    <li>✨ How this story shows that God always sees, knows, and cares for us</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• Bedtime reading during the Christmas season</li>
                    <li>• Family devotions and Christmas traditions</li>
                    <li>• Classroom read-aloud time</li>
                    <li>• Church gifts and Sunday school</li>
                    <li>• Children who love dogs, Christmas, adventure, and learning about God's love</li>
                  </ul>
                  
                  <p className="text-gray-600 mb-4">
                    Created with beautiful illustrations and a simple, warm tone, this book invites children to slow down, snuggle close, and discover the nativity story through fresh eyes. Maggie makes big truths easy to grasp—and impossible to forget.
                  </p>
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
                  className="text-red-600 p-0 h-auto"
                >
                  Read {book.reviewCount} reviews
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 text-white"
                >
                  <a href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy on Amazon
                  </a>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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

export default ChristmasBook;
