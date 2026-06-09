import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { booksData } from "@/data/bookReviews";
import ImageViewer from "@/components/books/ImageViewer";
import { useSEO } from "@/hooks/useSEO";
import { bookSEOData } from "@/data/seoData";
import { createBookStructuredData } from "@/utils/seoUtils";

const IndependenceDayBook = () => {
  const book = booksData.find(b => b.id === "independence-day");
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO optimization
  useSEO({
    ...bookSEOData["independence-day"],
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600">
            <a href="/" className="hover:text-red-600">Home</a>
            <span className="mx-2">&#8250;</span>
            <a href="/#books" className="hover:text-red-600">Books</a>
            <span className="mx-2">&#8250;</span>
            <span className="text-gray-800">Independence Day as told by Maggie to Matteo</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4">
              <img
                src={book.coverImage}
                alt="Independence Day as told by Maggie to Matteo - Patriotic Fourth of July Children's Book Cover"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(book.coverImage)}
              />
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Independence Day as told by Maggie to Matteo: A Patriotic Fourth of July Story for Kids | America's 250th Anniversary Edition
                </h1>

                {book.isNew && (
                  <Badge className="bg-gradient-to-r from-red-500 to-blue-500 text-white mb-4">
                    NEW
                  </Badge>
                )}

                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  {book.description}
                </p>

                {/* Enhanced Description for SEO */}
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Celebrate America's 250th Birthday with Maggie and Matteo!</h2>
                  <p className="text-gray-600 mb-4">
                    When fireworks wake little Matteo with a BOOM, his wise big sister Maggie takes him on a joyful, giggle-filled journey through the true story of how America was born.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Children Will Learn:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>&#127482;&#127480; The story of the thirteen colonies and brave founding fathers</li>
                    <li>&#127482;&#127480; The Boston Tea Party and the road to independence</li>
                    <li>&#127482;&#127480; The signing of the Declaration of Independence in 1776</li>
                    <li>&#127482;&#127480; Faith and gratitude rooted in Galatians 5:13</li>
                    <li>&#127482;&#127480; Why freedom is a gift worth celebrating</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>&#8226; Fourth of July family celebrations</li>
                    <li>&#8226; Teaching children American history</li>
                    <li>&#8226; Patriotic bedtime stories</li>
                    <li>&#8226; Kids ages 4&#8211;10 who love adventure and dogs!</li>
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
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        enlargedImage={enlargedImage}
        onClose={() => {
          setShowImageViewer(false);
          setEnlargedImage("");
        }}
      />

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default IndependenceDayBook;
