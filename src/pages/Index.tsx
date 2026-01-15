import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import MeetMaggie from "@/components/sections/MeetMaggie";
import Books from "@/components/sections/Books";
import Videos from "@/components/sections/Videos";
import Activities from "@/components/sections/Activities";
import WriteToMaggie from "@/components/sections/WriteToMaggie";
import Games from "@/components/sections/Games";
import GiveAway from "@/components/sections/GiveAway";
import Projects from "@/components/sections/Projects";
import NewsLetter from "@/components/sections/NewsLetter";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useSEO } from "@/hooks/useSEO";
import { homeSEOData } from "@/data/seoData";

const Index = () => {
  useSEO({
    ...homeSEOData,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Maggie's Bible Adventures",
      "url": window.location.origin,
      "description": homeSEOData.description,
      "author": {
        "@type": "Person",
        "name": "Maggie",
        "description": "A lovable dog who shares Bible stories and adventures with children"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Maggie's Bible Adventures"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  });

  return (
    <>
      <Navigation />
      <Hero />
      <Books />
      <MeetMaggie />
      <Videos />
      <Activities />
      <WriteToMaggie />
      <Games />
      <GiveAway />
      <Projects />
      <NewsLetter />
      <Contact />
      <Footer />
      <BackToTopButton />
      <ThemeSwitcher />
    </>
  );
};

export default Index;
