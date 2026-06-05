import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { useSEO } from "@/hooks/useSEO";

const verses = [
  { ref: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { ref: "1 John 4:9", text: "In this was manifested the love of God toward us, because that God sent his only begotten Son into the world, that we might live through him." },
  { ref: "1 John 4:19", text: "We love him, because he first loved us." },
  { ref: "Romans 8:38-39", text: "For I am persuaded, that neither death, nor life... shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
  { ref: "Jeremiah 31:3", text: "Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee." },
  { ref: "Psalm 86:15", text: "But thou, O Lord, art a God full of compassion, and gracious, longsuffering, and plenteous in mercy and truth." },
  { ref: "Zephaniah 3:17", text: "The Lord thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing." },
  { ref: "1 John 3:1", text: "Behold, what manner of love the Father hath bestowed upon us, that we should be called the sons of God." },
  { ref: "Psalm 136:26", text: "O give thanks unto the God of heaven: for his mercy endureth for ever." },
  { ref: "Ephesians 2:4-5", text: "But God, who is rich in mercy, for his great love wherewith he loved us, even when we were dead in sins, hath quickened us together with Christ." },
  { ref: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us." },
  { ref: "Psalm 103:11", text: "For as the heaven is high above the earth, so great is his mercy toward them that fear him." },
  { ref: "John 15:13", text: "Greater love hath no man than this, that a man lay down his life for his friends." },
  { ref: "Isaiah 43:4", text: "Since thou wast precious in my sight, thou hast been honourable, and I have loved thee." },
  { ref: "1 John 4:16", text: "God is love; and he that dwelleth in love dwelleth in God, and God in him." },
];

const BibleVersesGodsLove = () => {
  useSEO({
    title: "15 Bible Verses About God's Love for Kids | Books By Maggie",
    description: "A child-friendly guide to 15 KJV Bible verses about God's love. Perfect for parents, Sunday school teachers, and family devotions with kids.",
    keywords: [
      "bible verses about God's love for kids",
      "bible verses for children",
      "god's love scriptures kids",
      "children's devotional verses",
      "kjv bible verses for kids",
      "sunday school bible verses",
      "family devotions god's love",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "15 Bible Verses About God's Love for Kids",
      description: "A child-friendly guide to KJV Bible verses about God's love.",
      author: { "@type": "Organization", name: "Books By Maggie" },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            15 Bible Verses About God's Love for Kids
          </h1>
          <p className="text-lg text-muted-foreground">
            A child-friendly collection of KJV scriptures parents, grandparents, and Sunday school teachers can read with children to share the wonder of God's love.
          </p>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-3xl space-y-4">
          {verses.map((v, i) => (
            <article key={v.ref} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {i + 1}. {v.ref}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">"{v.text}"</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-8 text-center">
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              Keep Sharing God's Love
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Maggie's picture book <em>God's Love</em> brings these truths to life for little ones with warm illustrations and a story they'll ask for again and again.
            </p>
            <Link
              to="/books/gods-love"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Explore Maggie's "God's Love" Book
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BibleVersesGodsLove;
