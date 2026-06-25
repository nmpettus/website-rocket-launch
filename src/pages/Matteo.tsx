import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Camera, Video } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { useSEO } from "@/hooks/useSEO";

// Add new Matteo photos here as they are uploaded.
// Example: { src: "/lovable-uploads/matteo-playing.jpg", alt: "Matteo playing in the yard" }
const photos: { src: string; alt: string }[] = [
  { src: "/lovable-uploads/MatteoFront.png", alt: "Matteo the Yorkie puppy" },
];

// Add new Matteo videos here as they are uploaded.
// Example: { src: "/lovable-uploads/matteo-running.mp4", title: "Matteo running" }
const videos: { src: string; title: string; poster?: string }[] = [];

const Matteo = () => {
  useSEO({
    title: "Meet Matteo the Yorkie Puppy | Books by Maggie",
    description:
      "Meet Matteo, the adorable Yorkie puppy joining Maggie on her adventures. See photos and videos of Matteo as he grows.",
    keywords: ["Matteo", "Yorkie puppy", "Maggie", "Books by Maggie", "puppy photos", "puppy videos"],
    canonicalUrl: "https://booksbymaggie.com/matteo",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero */}
          <section className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Maggie's Little Buddy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Meet Matteo the Yorkie Puppy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Matteo is the newest member of the Books by Maggie family — a playful
              Yorkshire Terrier puppy learning all about life, love, and the Bible
              right alongside Maggie. Watch him grow through photos and videos here!
            </p>
          </section>

          {/* Featured image */}
          <section className="mb-16 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary/20" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-background flex items-center justify-center">
                <img
                  src="/lovable-uploads/MatteoFront.png"
                  alt="Matteo the Yorkie puppy"
                  className="w-[85%] h-[85%] object-contain"
                />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Matteo Photo Gallery
              </h2>
            </div>
            {photos.length === 0 ? (
              <p className="text-muted-foreground italic">
                More photos coming soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden bg-muted shadow-md aspect-square flex items-center justify-center"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Videos */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Video className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold">
                Matteo Videos
              </h2>
            </div>
            {videos.length === 0 ? (
              <p className="text-muted-foreground italic">
                Videos coming soon — check back to see Matteo in action!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-black shadow-md">
                    <video
                      controls
                      poster={video.poster}
                      className="w-full h-auto"
                      preload="metadata"
                    >
                      <source src={video.src} />
                      Your browser does not support the video tag.
                    </video>
                    <div className="p-3 bg-card">
                      <p className="font-medium text-foreground">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Matteo;
