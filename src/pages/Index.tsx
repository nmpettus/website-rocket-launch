
import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Books from "@/components/sections/Books";
import MeetMaggie from "@/components/sections/MeetMaggie";
import MaggieImagesSection from "@/components/sections/MaggieImagesSection";
import Activities from "@/components/sections/Activities";
import Games from "@/components/sections/Games";
import FutureProjects from "@/components/sections/FutureProjects";
import Newsletter from "@/components/sections/NewsLetter";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import WriteToMaggie from "@/components/sections/WriteToMaggie";

const Index = () => {
  return (
    <div className="font-sans min-h-screen">
      <Navigation />
      <Hero />
      <div id="books">
        <Books />
      </div>
      <MeetMaggie />
      <MaggieImagesSection />
      <div id="activities">
        <Activities />
      </div>
      <div id="games">
        <Games />
      </div>
      {/* Restore WriteToMaggie section BELOW Games and add scroll-mt-20 for navbar offset */}
      <div id="write-to-maggie" className="scroll-mt-20">
        <WriteToMaggie />
      </div>
      <FutureProjects />
      <div id="newsletter">
        <Newsletter />
      </div>
      <Contact />
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Index;
