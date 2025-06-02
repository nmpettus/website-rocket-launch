import React, { useState } from "react";
import BookCard from "@/components/books/BookCard";
import BookGiveaway from "@/components/books/BookGiveaway";
import ImageViewer from "@/components/books/ImageViewer";
import ReviewsModal, { Review } from "@/components/ReviewsModal";
import bookReviews, { booksData } from "@/data/bookReviews";

// Define language links for each book
const bookLanguageLinks = {
  creation: [
    { language: "English", url: "https://a.co/d/8DoEE31" },
    { language: "Spanish", url: "https://a.co/d/ccsCmGT" },
    { language: "Italian", url: "https://a.co/d/86irzfP" }
  ],
  noah: [
    { language: "English", url: "https://a.co/d/5czEdgO" }
  ],
  jonah: [
    { language: "English", url: "https://a.co/d/1NfnyaE" }
  ]
};

const Books = () => {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const handleOpenReviews = (bookId: string, title: string) => {
    setSelectedBook(bookId);
    setSelectedReviews(bookReviews[bookId as keyof typeof bookReviews] || []);
    setSelectedTitle(title);
  };

  const handleCloseReviews = () => {
    setSelectedBook(null);
  };

  const handleImageClick = (imageSrc: string) => {
    setEnlargedImage(imageSrc);
  };

  return (
    <section id="books" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800 font-['Comic_Neue']">Our Book Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {booksData.map(book => (
            <BookCard
              key={book.id}
              coverImage={book.coverImage}
              title={book.title}
              languages={book.languages}
              languageLinks={book.id === "creation" ? bookLanguageLinks.creation : 
                            book.id === "noah" ? bookLanguageLinks.noah : 
                            book.id === "jonah" ? bookLanguageLinks.jonah : undefined}
              description={book.description}
              reviewCount={book.reviewCount}
              amazonLink={book.amazonLink}
              bookId={book.id}
              onOpenReviews={handleOpenReviews}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
        
        {/* Image Viewer component */}
        <ImageViewer 
          enlargedImage={enlargedImage}
          onClose={() => setEnlargedImage(null)}
        />
        
        {/* Reviews Modal */}
        {selectedBook && (
          <ReviewsModal 
            isOpen={!!selectedBook}
            onClose={handleCloseReviews}
            bookTitle={selectedTitle}
            reviews={selectedReviews}
          />
        )}
        
        {/* Book Giveaway section */}
        <BookGiveaway />
      </div>
    </section>
  );
};

export default Books;
