import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredVideos } from "@/data/videosData";
import { Link } from "react-router-dom";
import VideoVoting from "@/components/VideoVoting";

const Videos = () => {
  return (
    <section id="videos" className="py-24 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <Video className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Watch & Learn</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Featured Videos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch Maggie come to life in these delightful videos! Get a behind-the-scenes look at her adventures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredVideos.map((video) => (
            <div key={video.id} className="bg-card rounded-xl shadow-card overflow-hidden border border-border hover:shadow-lg transition-shadow duration-200">
              <Dialog>
                <DialogTrigger className="w-full">
                  <div className="relative group cursor-pointer">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-card rounded-full p-4">
                        <Play className="w-8 h-8 text-primary" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-foreground/70 rounded-full p-2">
                      <Video className="w-4 h-4 text-card" />
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
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {video.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {video.description}
                </p>
                
                <VideoVoting videoId={video.id} className="justify-center" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Videos Button */}
        <div className="text-center space-y-6">
          <Link to="/videos">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 h-12">
              View All Videos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          
          <div>
            <p className="text-muted-foreground mb-4">
              Have a video idea for Maggie? We'd love to hear from you!
            </p>
            <a href="mailto:maggie@booksbymaggie.com?subject=Video Suggestion for Maggie">
              <Button variant="outline">
                Suggest a Video
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videos;
