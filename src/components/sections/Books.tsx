import React, { useState } from "react";
import BookCard from "@/components/books/BookCard";
import BookGiveaway from "@/components/books/BookGiveaway";
import ImageViewer from "@/components/books/ImageViewer";
import BookSampleViewer from "@/components/books/BookSampleViewer";
import ReviewsModal, { Review } from "@/components/ReviewsModal";
import bookReviews, { booksData, SamplePage } from "@/data/bookReviews";

// Define language links for each book
const bookLanguageLinks = {
  "gods-love": [
    { language: "English", url: "https://a.co/d/a1KplpW" }
  ],
  creation: [
    { language: "English", url: "https://a.co/d/8DoEE31" },
    { language: "Spanish", url: "https://a.co/d/ccsCmGT" },
    { language: "Italian", url: "https://a.co/d/86irzfP" },
    { language: "Kindle", url: "https://www.amazon.com/Creation-told-Maggie-Beloved-Generation-ebook/dp/B0FRVXFZSX/ref=tmm_kin_swatch_0?_encoding=UTF8&dib_tag=se&dib=eyJ2IjoiMSJ9.BwbJeoyC49WDoBkR4KRx3JVNtDY6MUZIMID_hWhopZtE0_WaTTQw-3DV8w-xCkj7T4QqfvRvDhcV9fDk52e6sdtyogVW1uutZBMaUxVw3fXIBbkZIw3ttbO4BqymQFOtOM9StexQJtUTaG8ysIAjNGzRRQPRUV-27b5ImWNWpGdlmArdDzsBPkHgrUAAtpus.Iyo7h1nvFki8KhttY3go09QquyuIwT8lRxIrtyla2uw&qid=1758454617&sr=8-1" }
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
  const [selectedSample, setSelectedSample] = useState<{
    bookId: string;
    title: string;
    pages: SamplePage[];
  } | null>(null);

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

  const handleOpenSample = (bookId: string, title: string) => {
    const book = booksData.find(b => b.id === bookId);
    if (book && book.samplePages) {
      setSelectedSample({
        bookId,
        title,
        pages: book.samplePages
      });
    }
  };

  const handleCloseSample = () => {
    setSelectedSample(null);
  };

  return (
    <section id="books" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800 font-['Comic_Neue']">Our Book Collection- Bible Stories for Kids</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {booksData.map(book => (
            <BookCard
              key={book.id}
              coverImage={book.coverImage}
              title={book.title}
              languages={book.languages}
              languageLinks={book.id === "gods-love" ? bookLanguageLinks["gods-love"] :
                            book.id === "creation" ? bookLanguageLinks.creation : 
                            book.id === "noah" ? bookLanguageLinks.noah : 
                            book.id === "jonah" ? bookLanguageLinks.jonah : undefined}
              description={book.description}
              reviewCount={book.reviewCount}
              amazonLink={book.amazonLink}
              kindleLink={book.kindleLink}
              bookId={book.id}
              isNew={book.isNew}
              samplePages={book.samplePages}
              onOpenReviews={handleOpenReviews}
              onImageClick={handleImageClick}
              onOpenSample={handleOpenSample}
            />
          ))}
        </div>
        
        {/* Image Viewer component */}
        <ImageViewer 
          enlargedImage={enlargedImage}
          onClose={() => setEnlargedImage(null)}
        />
        
        {/* Sample Viewer component */}
        {selectedSample && (
          <BookSampleViewer
            isOpen={!!selectedSample}
            onClose={handleCloseSample}
            bookTitle={selectedSample.title}
            samplePages={selectedSample.pages}
          />
        )}
        
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
