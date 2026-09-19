import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, BookOpen, MessageSquare, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { useSEO } from "@/hooks/useSEO";
import artieImg from "@/assets/artie.png";

const Artie = () => {
  useSEO({
    title: "Meet Artie the AI Robot | Books by Maggie",
    description:
      "Meet Artie, the friendly AI robot who helps Maggie the Yorkie and Riley explore how computers see, learn, and talk in Maggie's AI Adventure books.",
    keywords: ["Artie", "AI robot", "Maggie's AI Adventure", "Books by Maggie", "AI books for kids"],
    canonicalUrl: "https://booksbymaggie.com/artie",
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
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Friendly AI Robot</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Meet Artie the AI Robot
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Artie is Riley's robot friend and the walking, blinking answer key of the AI
              Adventure books. He shows kids exactly how a machine sees, learns, gets
              confused — and, starting in Book 2, how it learns to talk.
            </p>
          </section>

          <section className="mb-16 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 to-accent/25" />
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-background flex items-center justify-center">
                <img
                  src={artieImg}
                  alt="Artie the AI robot"
                  className="w-[88%] h-[88%] object-contain"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <Eye className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">How Machines "See"</h2>
              <p className="text-foreground/80">
                In Book 1, Artie helps Maggie and Riley uncover pixels, patterns, and how
                computers learn — including the funny mistakes they make.
              </p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <MessageSquare className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">Learning to Talk</h2>
              <p className="text-foreground/80">
                In Book 2, Artie suddenly starts speaking — sparking Maggie's newest mystery:
                how can a machine with no ears hear, and no mouth talk?
              </p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <Bot className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">Helpful, Never Scary</h2>
              <p className="text-foreground/80">
                Artie is written to make AI feel friendly and understandable, while being
                honest about what technology can and cannot do.
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-secondary/40 border border-border p-8 mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Artie's Place in Maggie's World
            </h2>
            <p className="text-foreground/80 mb-4">
              Maggie leads two kinds of stories. Her Bible storybooks teach faith alongside her
              little buddy Matteo. Her <strong>AI Adventure</strong> books teach technology —
              and that's Artie's home, together with Riley the tech-curious kid.
            </p>
            <p className="text-foreground/80">
              Across both AI Adventure books, Maggie plays the Yorkie detective, Riley asks the
              questions, and Artie demonstrates the answers — covering voice assistants,
              translation apps, closed captions, and chatbots kids already use every day.
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
                to="/riley"
                className="inline-flex items-center gap-2 bg-card border border-border font-semibold px-5 py-3 rounded-xl hover:bg-muted transition-colors"
              >
                Meet Riley
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Artie;
