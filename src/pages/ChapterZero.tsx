import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import comicPanel1 from "@/assets/comic-panel-1.png";
import comicPanel2 from "@/assets/comic-panel-2.png";
import comicPanel3 from "@/assets/comic-panel-3.png";
import comicPanel4 from "@/assets/comic-panel-4.png";

const ChapterZero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [pollVote, setPollVote] = useState<string | null>(null);

  useSEO({
    title: "Chapter Zero - Secret Adventure | Maggie's AI Adventures",
    description: "Unlock the secret Chapter Zero with exclusive content from Maggie's AI Adventures - featuring a welcome video, comic strip, and interactive activities.",
    keywords: ["chapter zero", "secret page", "AI adventures", "Maggie", "exclusive content", "interactive story"]
  });

  const characters = [
    {
      id: "maggie",
      name: "Maggie",
      image: "/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png",
      funFact: "I love midnight snacks and solving AI mysteries! My favorite treat is digital dog biscuits."
    },
    {
      id: "alex",
      name: "Alex",
      image: "/lovable-uploads/a44b3fc6-baa0-48bd-8f0c-4a126c20bf46.png",
      funFact: "I'm the tech wizard of the group! I can code in 7 different programming languages."
    },
    {
      id: "professor",
      name: "Professor Bot",
      image: "/lovable-uploads/96d18d5d-f08b-4f0c-bbd6-48259e4a9477.png",
      funFact: "I've been teaching AI concepts for over 50 years! My circuits light up when kids ask great questions."
    }
  ];

  const pollOptions = [
    { id: "helper", text: "A super-smart helper", votes: 42 },
    { id: "robot", text: "A friendly robot friend", votes: 38 },
    { id: "magic", text: "Computer magic", votes: 15 },
    { id: "future", text: "The future of everything", votes: 25 }
  ];

  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes + (pollVote === option.id ? 1 : 0), 0);

  return (
    <div className="min-h-screen bg-blue-50">
      
      {/* Section 1: Welcome Video */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="font-lato font-bold text-4xl md:text-5xl text-gray-800 mb-8 leading-tight">
            You've Unlocked a Secret<br />
            Mini-Adventure!
          </h1>

          {/* Video */}
          <div className="relative w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl mb-8">
            <video
              className="w-full h-full object-cover"
              controls
              muted={isMuted}
              preload="metadata"
              poster="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png"
            >
              <source src="/lovable-uploads/MaggieAIBackCoverIntroVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Mute/Unmute Button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? "Tap to Unmute" : "Muted"}
            </Button>
          </div>

          {/* Scroll Cue */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-600 mx-auto" />
          </div>
        </div>
      </section>

      {/* Section 2: Exclusive Comic Strip */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-lora italic text-3xl text-gray-800 mb-12">
            A Story Not Found in the Book: Maggie and the Midnight Snack
          </h2>
          
          {/* Comic Strip */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Panel 1 - Actual comic panel */}
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                <img 
                  src={comicPanel1} 
                  alt="Late one night, Maggie's tummy had a mission: Operation Midnight Snack!"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Panel 2 - Actual comic panel */}
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                <img 
                  src={comicPanel2} 
                  alt="But the giant food fortress was sealed tight. How could a little pup get inside?"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Panel 3 - Actual comic panel */}
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                <img 
                  src={comicPanel3} 
                  alt="Suddenly, the fridge woke up! It knew Norman was there before he even touched it. Was it... magic?"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Panel 4 - Actual comic panel */}
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                <img 
                  src={comicPanel4} 
                  alt="It wasn't magic... it was AI! And this was just the beginning of Maggie's adventures. The rest of the story is waiting for you inside the book!"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Playground */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-lato font-bold text-4xl text-gray-800 text-center mb-16">
            Meet the Adventure Team!
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Meet the Cast */}
            <div>
              <h3 className="font-lato font-bold text-2xl text-gray-700 mb-8 text-center">
                Meet the Cast
              </h3>
              <div className="space-y-6">
                {characters.map((character) => (
                  <Card key={character.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={character.image} 
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-lato font-bold text-lg text-gray-800">{character.name}</h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mt-2">
                                Fun Fact
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <div className="text-center">
                                <img 
                                  src={character.image} 
                                  alt={character.name}
                                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="font-lato font-bold text-xl mb-4">{character.name}</h3>
                                <p className="font-lora text-gray-600">{character.funFact}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: AI Poll */}
            <div>
              <h3 className="font-lato font-bold text-2xl text-gray-700 mb-8 text-center">
                What Do You Think?
              </h3>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-lora text-lg text-gray-800 mb-6 text-center">
                    What is AI to you?
                  </h4>
                  <div className="space-y-3">
                    {pollOptions.map((option) => {
                      const votes = option.votes + (pollVote === option.id ? 1 : 0);
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={option.id}>
                          <Button
                            variant={pollVote === option.id ? "default" : "outline"}
                            className="w-full justify-start mb-2"
                            onClick={() => setPollVote(option.id)}
                          >
                            {option.text}
                            {pollVote && (
                              <Badge variant="secondary" className="ml-auto">
                                {percentage}%
                              </Badge>
                            )}
                          </Button>
                          {pollVote && (
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {pollVote && (
                    <p className="text-sm text-gray-600 text-center mt-4">
                      Thanks for voting! Results update in real-time.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Bridge to the Future */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="order-2 md:order-1">
              <img 
                src="/lovable-uploads/AI-Adventures-with-Maggie-new-cover.png" 
                alt="AI Adventures with Maggie Book Cover"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>

            {/* Final Message */}
            <div className="order-1 md:order-2 text-left">
              <h2 className="font-lato font-bold text-4xl text-gray-800 mb-6">
                The Rest of the Adventure is Waiting...
              </h2>
              <p className="font-lora text-lg text-gray-600 mb-8 leading-relaxed">
                This was just a taste of the fun! The full book is packed with more stories, 
                incredible diagrams, and dozens of activities for your family to explore together.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get the Full Book
              </Button>
            </div>
          </div>

          {/* Link to Main Website */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-lora">
              For parent resources, author information, and more books, visit{" "}
              <a href="/" className="text-blue-600 hover:underline">
                booksbymaggie.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ChapterZero;