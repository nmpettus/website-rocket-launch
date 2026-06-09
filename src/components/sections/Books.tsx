import React, { useState } from "react";
import BookCard from "@/components/books/BookCard";
import BookGiveaway from "@/components/books/BookGiveaway";
import ImageViewer from "@/components/books/ImageViewer";
import BookSampleViewer from "@/components/books/BookSampleViewer";
import ReviewsModal, { Review } from "@/components/ReviewsModal";
import bookReviews, { booksData, SamplePage } from "@/data/bookReviews";
import { BookOpen, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section id="books" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Library</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Maggie's Bookshelf
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beautiful Bible stories brought to life through Maggie's heartwarming adventures. 
            Perfect for bedtime reading and family devotions.
          </p>
        </div>
        
        {/* Free Easter Story Banner */}
        <Link to="/books/easter" className="block mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-emerald-400 p-[2px] shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white/90 dark:bg-charcoal/90 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <Gift className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-base md:text-lg font-bold text-foreground">🐣 Maggie's Easter Story — </span>
                  <span className="text-base md:text-lg font-semibold text-emerald-600">FREE Download!</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors whitespace-nowrap">
                Get it now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              appleBooksLink={book.appleBooksLink}
              bookId={book.id}
              isNew={book.isNew}
              comingSoon={book.comingSoon}
              isFree={book.isFree}
              pdfDownloadUrl={book.pdfDownloadUrl}
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
