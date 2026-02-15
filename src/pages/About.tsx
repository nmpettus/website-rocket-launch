import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { useSEO } from "@/hooks/useSEO";

const About = () => {
  useSEO({
    title: "About the Authors | Books By Maggie",
    description: "Meet Norm and Marianna, the husband-and-wife team behind Books By Maggie. Learn about their mission to share faith-based stories with children everywhere.",
    keywords: ["about", "authors", "Norm", "Marianna", "faith-based children's books", "mission"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Our Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The heart and mission behind Books By Maggie
          </p>
        </div>
      </section>

      {/* Authors Section */}
      <section className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="flex justify-center">
              <img
                src="/lovable-uploads/our-team.jpeg"
                alt="Norm and Marianna"
                className="rounded-2xl shadow-lg w-full max-w-sm object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold text-foreground">
                Meet Norm & Marianna
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We're a husband-and-wife team united by our faith and a shared passion for storytelling. Together, we create children's books that bring Bible stories to life in a way that's fun, engaging, and meaningful for young readers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey began with a simple idea: every child deserves to experience the wonder of God's love through stories they can relate to. With Maggie — our beloved Yorkie Poo — as our storytelling companion, we set out to make that vision a reality.
              </p>
            </div>
          </div>

          {/* Mission Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Faith-Centered</h3>
              <p className="text-sm text-muted-foreground">
                Every story is rooted in Biblical truth and designed to nurture a child's relationship with God.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Joyful Learning</h3>
              <p className="text-sm text-muted-foreground">
                We believe learning about faith should be an adventure — filled with wonder, creativity, and fun.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">For Every Family</h3>
              <p className="text-sm text-muted-foreground">
                Our books are perfect for bedtime reading, homeschool curricula, Sunday school, and family devotions.
              </p>
            </div>
          </div>

          {/* Extended Bio */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Books By Maggie, our mission is simple: to plant seeds of faith in the hearts of children through the power of storytelling. We want every child who picks up one of our books to feel God's love, learn timeless lessons, and be inspired to grow in their faith journey.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the creation story to the adventures of Jonah, from Noah's Ark to the birth of Jesus — we bring these beloved stories to life with vibrant illustrations, relatable characters, and Maggie's warm, encouraging voice guiding children through every page.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We're also passionate about giving back. Through our book giveaway program, we work to ensure that children from all backgrounds have access to faith-based literature that can shape their lives for the better.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
