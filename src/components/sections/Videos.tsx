
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredVideos } from "@/data/videosData";
import { Link } from "react-router-dom";
import VideoVoting from "@/components/VideoVoting";

const Videos = () => {
  return (
    <section id="videos" className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800 font-['Comic_Neue']">
          Featured Videos with Maggie
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Watch Maggie come to life in these delightful videos! Get a behind-the-scenes look at her adventures and stories.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Dialog>
                <DialogTrigger className="w-full">
                  <div className="relative group cursor-pointer">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-indigo-600" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 rounded-full p-2">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-2">
                  <DialogTitle>{video.title}</DialogTitle>
                  <div className="aspect-video w-full">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-['Comic_Neue']">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {video.description}
                </p>
                
                {/* Add voting component */}
                <VideoVoting videoId={video.id} className="justify-center" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Videos Button */}
        <div className="text-center">
          <Link to="/videos">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              View All Videos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Have a video idea for Maggie? We'd love to hear from you!
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
          >
            Suggest a Video
          </button>
        </div>
      </div>
    </section>
  );
};

export default Videos;
