import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import Books from "@/components/sections/Books";
import MeetMaggie from "@/components/sections/MeetMaggie";
import MaggieImagesSection from "@/components/sections/MaggieImagesSection";
import Activities from "@/components/sections/Activities";
import FutureProjects from "@/components/sections/FutureProjects";
import Newsletter from "@/components/sections/NewsLetter";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";

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