
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const giveawayPhotos = [
  {
    id: 1,
    image: "/lovable-uploads/1161ce18-0828-45cc-b55c-d4a92af47337.png",
    caption: "Bedtime stories with Maggie's books! These little readers are enjoying their favorite Bible stories."
  },
  {
    id: 2,
    image: "/lovable-uploads/87c8afe6-f07e-48fd-8860-24daef7380f7.png",
    caption: "Taking Maggie's adventures on the go! Perfect reading companion for bus rides."
  },
  {
    id: 3,
    image: "/lovable-uploads/e1ee0666-1406-48a0-8c15-87612af92b91.png",
    caption: "Sharing the joy of reading with friends! Maggie's books bring families together."
  },
  {
    id: 4,
    image: "/lovable-uploads/ee284f2e-846d-493e-8ea4-a50ff148afcb.png",
    caption: "Meeting young readers and sharing the Italian version of Maggie's Creation story."
  },
  {
    id: 5,
    image: "/lovable-uploads/3b0f9a25-1546-4a93-a3b8-59f801c2819e.png",
    caption: "Family time with Maggie's books at the restaurant! Stories that bring generations together."
  },
  {
    id: 6,
    image: "/lovable-uploads/aab438b1-7b4b-4651-9909-e016edaae8f4.png",
    caption: "Book signing event! Meeting families and sharing the love of reading with young fans."
  },
  {
    id: 7,
    image: "/lovable-uploads/a3353033-3d67-4239-8185-60953ae56c7e.png",
    caption: "Even airplane journeys are better with Maggie's books! Stories that travel with you."
  }
];

const GiveAway = () => {
  return (
    <section id="kids" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800 font-['Comic_Neue']">
          Kids Love Maggie's Books!
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          See how children around the world are enjoying Maggie's Bible stories! From bedtime reading to family adventures, these precious moments show the joy our books bring to young readers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giveawayPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={photo.image} 
                    alt={`Kids enjoying Maggie's books - ${photo.id}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 italic">
            Want to share your child's reading moment with Maggie's books? 
            <br />
            Send us your photos and we might feature them here!
          </p>
        </div>
      </div>
    </section>
  );
};

export default GiveAway;
