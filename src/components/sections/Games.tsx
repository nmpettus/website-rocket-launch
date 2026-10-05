import React from "react";
import MaggiesBibleAdventure from "@/components/games/MaggiesBibleAdventure";
import { Gamepad2, Compass, Sparkles, ArrowRight } from "lucide-react";

const Games = () => {
  return (
    <section id="games" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Learning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Games & Adventures
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join Maggie on interactive adventures that teach valuable Bible lessons through fun gameplay
          </p>
        </div>
        
        {/* New Game Invite Banner */}
        <a
          href="https://booksbymaggie.com/pilgrim"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mb-12 block overflow-hidden rounded-3xl bg-gradient-to-r from-gold via-rose to-primary p-[3px] shadow-book transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-sage-dark px-6 py-8 text-center sm:flex-row sm:px-10 sm:text-left">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-rose text-background shadow-elegant">
              <Compass className="h-8 w-8" />
            </div>

            <div className="relative flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 animate-sparkle text-gold motion-reduce:animate-none" />
                <span className="text-xs font-bold uppercase tracking-widest text-gold">
                  New Game!
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Maggie's Pilgrim's Progress Adventure
              </h3>
              <p className="mt-1 text-base text-muted-foreground">
                Journey from the City of Destruction to the Celestial City — a brand-new game for the whole family at{" "}
                <span className="font-semibold text-gold">booksbymaggie.com/pilgrim</span>
              </p>
            </div>

            <div className="relative shrink-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-rose px-6 py-3 font-bold text-background shadow-elegant transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
                Play Now
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
              </span>
            </div>
          </div>
        </a>

        <div className="flex justify-center">
          <MaggiesBibleAdventure />
        </div>
      </div>
    </section>
  );
};

export default Games;
