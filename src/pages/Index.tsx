
import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Books from "@/components/sections/Books";
import MeetMaggie from "@/components/sections/MeetMaggie";
import MaggieImagesSection from "@/components/sections/MaggieImagesSection";
import Videos from "@/components/sections/Videos";
import Activities from "@/components/sections/Activities";
import Games from "@/components/sections/Games";
import Projects from "@/components/sections/Projects";
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
      <div id="videos">
        <Videos />
      </div>
      <div id="activities">
        <Activities />
      </div>
      <div id="games">
        <Games />
      </div>
      <div id="write-to-maggie" className="scroll-mt-20">
        <WriteToMaggie />
      </div>
      <Projects />
      <div id="newsletter">
        <Newsletter />
      </div>
      <Contact />
      <div id="footer">
        <Footer />
      </div>
      <BackToTopButton />
    </div>
  );
};

export default Index;
