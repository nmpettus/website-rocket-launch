
import React from "react";
import { Button } from "@/components/ui/button";

const BookGiveaway = () => {
  return (
    <div className="mt-16 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-xl p-8 text-white">
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-1 md:pr-6">
          <h3 className="text-2xl font-bold mb-4 font-['Comic_Neue']">Free Book Giveaway!</h3>
          <p className="mb-6">Through our GiveSendGo campaign, we're able to provide free books to children in need. Help us spread the joy of reading!</p>
          <Button 
            className="bg-white hover:bg-gray-100 text-indigo-600 font-bold rounded-full"
            onClick={() => window.open("https://givesendgo.com/GFQ8W?utm_source=sharelink&utm_medium=copy_link&utm_campaign=GFQ8W", "_blank")}
          >
            Support Our Campaign
          </Button>
        </div>
        <div className="md:w-1/3 p-4 mt-6 md:mt-0 flex justify-center">
          <div className="bg-white p-2 rounded-lg shadow-md w-48 h-48">
            <img 
              src="/lovable-uploads/8eb8d306-89d0-44c9-9ad6-cb7068e47e38.png" 
              alt="QR Code for Free Book Giveaway" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookGiveaway;
