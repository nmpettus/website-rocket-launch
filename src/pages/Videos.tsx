import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Video, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allVideos, videoCategories, VideoData } from "@/data/videosData";
import Navigation from "@/components/Navigation";
import VideoVoting from "@/components/VideoVoting";

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredVideos = allVideos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20">
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold mb-4 text-gray-800 font-['Comic_Neue']">
                All Videos with Maggie
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                Explore all of Maggie's wonderful video adventures! From Bible stories to fun activities, 
                there's something special for everyone.
              </p>
              <p className="text-lg text-indigo-600 font-medium">
                🗳️ Vote for your favorites! Let us know which videos you love most!
              </p>
              
              {/* YouTube Channel Link */}
              <div className="mt-6">
                <a 
                  href="https://www.youtube.com/@nmpettus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-300/50 animate-pulse hover:animate-none"
                  style={{
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)',
                    animation: 'glow 2s ease-in-out infinite alternate'
                  }}
                >
                  <Video className="w-5 h-5" />
                  See all of Maggie's videos
                </a>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg rounded-full border-2 border-indigo-200 focus:border-indigo-400"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                {videoCategories.map(category => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${videoCategories.find(c => c.id === selectedCategory)?.label}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            
            {/* Videos Grid - Standardized size for all videos */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Dialog>
                      <DialogTrigger className="w-full">
                        <div className="relative group cursor-pointer">
                          {/* Standardized aspect ratio for all video previews */}
                          <div className="aspect-video">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-8 h-8 text-indigo-600" fill="currentColor" />
                              </div>
                            </div>
                            <div className="absolute top-3 right-3 bg-black bg-opacity-70 rounded-full p-2">
                              <Video className="w-4 h-4 text-white" />
                            </div>
                            {video.featured && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Featured
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-2">
                        <DialogTitle>{video.title}</DialogTitle>
                        {/* Keep original aspect ratio in modal */}
                        <div className={video.aspectRatio === '9:16' ? "aspect-[9/16] max-w-md mx-auto" : "aspect-video w-full"}>
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
                      <h3 className="text-xl font-bold text-gray-800 mb-2 font-['Comic_Neue'] line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                          {videoCategories.find(c => c.id === video.category)?.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {video.aspectRatio === '9:16' ? 'Vertical' : 'Landscape'}
                        </span>
                      </div>
                      
                      {/* Voting Component */}
                      <VideoVoting videoId={video.id} className="justify-center" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No videos found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 font-['Comic_Neue']">
                Want to see more videos?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have a video idea for Maggie? We're always creating new content and would love to hear your suggestions!
              </p>
              <Button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
              >
                Suggest a Video
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Videos;
