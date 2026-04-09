import React, { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { booksData } from "@/data/bookReviews";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const bookRoutes: Record<string, string> = {
  "gods-love": "/books/gods-love",
  "creation": "/books/creation",
  "noah": "/books/noahs-ark",
  "jonah": "/books/jonah",
  "christmas": "/books/christmas",
  "thanksgiving": "/books/thanksgiving",
  "ai-adventures": "/books/ai-adventures",
  "easter": "/books/easter",
  "bible-heroes": "/online-library",
};

const OnlineLibrary = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 pointer-events-none" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <BookOpen className="w-10 h-10 text-primary" />
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            Maggie's Online Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Explore faith-filled Bible stories told by Maggie the Yorkie! 📚
          </p>
          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto">
            Pick a book and start reading — it's like having storytime with your best furry friend! 🐾
          </p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...booksData].sort((a, b) => (a.isFree ? 0 : 1) - (b.isFree ? 0 : 1)).map((book) => (
              <Link
                key={book.id}
                to={bookRoutes[book.id] || "/"}
                className="group block"
              >
                <Card className="h-full overflow-hidden border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {book.isNew && (
                        <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 shadow-md">
                          ✨ NEW
                        </Badge>
                      )}
                      {book.isFree && (
                        <Badge className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 shadow-md">
                          🎁 FREE
                        </Badge>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 rounded-full p-4 shadow-lg">
                        <BookOpen className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Heart className="w-3 h-3 text-primary" />
                        <span>{book.reviewCount} reviews</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center border border-border">
            <p className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              More Stories Coming Soon! 🎉
            </p>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Maggie is always working on new adventures. Check back often for new Bible stories and fun reads!
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default OnlineLibrary;
