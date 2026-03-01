import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Gift } from "lucide-react";
import { booksData } from "@/data/bookReviews";
import ImageViewer from "@/components/books/ImageViewer";
import { useSEO } from "@/hooks/useSEO";
import { bookSEOData } from "@/data/seoData";
import { Link } from "react-router-dom";

const EasterBook = () => {
  const book = booksData.find(b => b.id === "easter");
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSEO({
    ...bookSEOData["easter"],
    structuredData: null
  });

  if (!book) {
    return <div>Book not found</div>;
  }

  const handleImageClick = (imageSrc: string) => {
    setEnlargedImage(imageSrc);
    setShowImageViewer(true);
  };

  const downloadUrl = (book.pdfDownloadUrl ?? "/books/easter-story.pdf").replace(/^\.\//, "/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <span className="mx-2">›</span>
            <a href="/#books" className="hover:text-purple-600">Books</a>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Maggie's Easter Story</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="space-y-4">
              <img
                src={book.coverImage}
                alt="Maggie's Easter Story - A free children's Easter story about hope, love, and new beginnings"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(book.coverImage)}
              />
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {book.title}
                  </h1>
                </div>
                
                <Button
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-600 text-white mb-4 text-sm px-4 py-1 h-auto rounded-full"
                >
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Gift className="w-4 h-4 mr-1" />
                    FREE Download
                  </a>
                </Button>

                <p className="text-lg text-gray-600 leading-relaxed mb-4 mt-4">
                  {book.description}
                </p>

                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Celebrate Easter with Maggie!</h2>
                  <p className="text-gray-600 mb-4">
                    This free downloadable PDF brings the true meaning of Easter to life through Maggie's warm, playful storytelling. Perfect for reading together as a family during the Easter season.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">What's Inside:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>🌷 The Easter story told through Maggie's loving perspective</li>
                    <li>🐣 Beautiful illustrations that bring the story to life</li>
                    <li>✝️ Age-appropriate exploration of hope, love, and new beginnings</li>
                    <li>🌸 Perfect for bedtime reading, Sunday school, or family devotions</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfect For:</h3>
                  <ul className="text-gray-600 mb-4">
                    <li>• Easter baskets and gifts</li>
                    <li>• Family reading time during Holy Week</li>
                    <li>• Sunday school and church activities</li>
                    <li>• Children who love Maggie and her stories</li>
                  </ul>
                </div>
              </div>

              {/* Download Button */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6"
                >
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5 mr-2" />
                    Download Free Easter Story PDF
                  </a>
                </Button>
                <p className="text-center text-sm text-gray-500">
                  No sign-up required — just click and download! 🐣
                </p>
              </div>

              {/* FAQ */}
              <div className="bg-white/60 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Is this really free?</h4>
                  <p className="text-gray-600 text-sm">Yes! This Easter story is our gift to families everywhere. No purchase or sign-up required.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">What age group is this for?</h4>
                  <p className="text-gray-600 text-sm">This story is perfect for children ages 3–10, and great for reading together with parents or grandparents.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Can I share this with others?</h4>
                  <p className="text-gray-600 text-sm">Absolutely! Feel free to share the link with friends, family, and your church community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default EasterBook;
