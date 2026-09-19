import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, BookOpen, Lightbulb, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { useSEO } from "@/hooks/useSEO";
import rileyImg from "@/assets/riley.png";

const Riley = () => {
  useSEO({
    title: "Meet Riley the Tech-Curious Kid | Books by Maggie",
    description:
      "Meet Riley, the tech-curious kid who teams up with Maggie the Yorkie and Artie the AI robot in Maggie's AI Adventure books.",
    keywords: ["Riley", "Maggie's AI Adventure", "tech curious kid", "Books by Maggie", "AI books for kids"],
    canonicalUrl: "https://booksbymaggie.com/riley",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 active:text-primary/60 font-medium mb-8 px-3 py-2 -ml-3 rounded-lg transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <section className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Maggie's Curious Sidekick</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Meet Riley the Tech-Curious Kid
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Riley is the question-asker of the group. When something beeps, blinks, or
              suddenly starts talking, Riley wants to know how it works — and that curiosity
              is what sends Maggie and Artie off on every AI adventure.
            </p>
          </section>

          <section className="mb-16 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary/20" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-background flex items-center justify-center">
                <img
                  src={rileyImg}
                  alt="Riley the tech-curious kid"
                  className="w-[90%] h-[90%] object-contain"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <Lightbulb className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">Always Asking Why</h2>
              <p className="text-foreground/80">
                Riley never settles for "it just works." Every chapter starts with a real
                question kids ask — how does a computer see, learn, hear, or talk?
              </p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <Users className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">Maggie's Partner</h2>
              <p className="text-foreground/80">
                Maggie brings the detective nose; Riley brings the human heart. Together they
                keep the adventures fun, kind, and easy to follow for ages 7–12.
              </p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <Sparkles className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">Artie's Best Friend</h2>
              <p className="text-foreground/80">
                Artie is Riley's robot friend. When Artie suddenly learns to speak in Book 2,
                Riley is the first to wonder how a machine with no ears can hear.
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-secondary/40 border border-border p-8 mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Riley's Place in Maggie's World
            </h2>
            <p className="text-foreground/80 mb-4">
              Maggie's books come in two families. The Bible storybooks — Creation, Noah,
              Jonah, God's Love and more — are led by Maggie the Yorkie with her little buddy
              Matteo. The <strong>Maggie's AI Adventure</strong> series is where Riley and
              Artie live, turning big technology ideas into a story kids can follow.
            </p>
            <p className="text-foreground/80">
              In Book 1, Riley joins Maggie and Artie to discover what AI really is, how it
              "sees," how it learns, and what it can and cannot do. In Book 2, the three of
              them crack the code on speech, language, voice assistants, translation apps and
              captions.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/maggies-ai-adventures"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Explore Maggie's AI Adventures
              </Link>
              <Link
                to="/artie"
                className="inline-flex items-center gap-2 bg-card border border-border font-semibold px-5 py-3 rounded-xl hover:bg-muted transition-colors"
              >
                Meet Artie
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Riley;
